'use strict';

/* ============================================================
   VOYAGER — Authentication & Toast Notification Module
   Handles user sign-in, registration, demo accounts,
   token persistence, navigation state, and toast alerts.
   ============================================================ */

var authState = {
  user: null,
  token: localStorage.getItem('voyager_token') || null,
};

/* ── Toast Notification System ── */
function showToast(message, type) {
  type = type || 'info';
  var container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  var icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML =
    '<div class="toast-icon">' + (icons[type] || 'ℹ') + '</div>' +
    '<div class="toast-message">' + message + '</div>';

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(function () {
    toast.classList.add('show');
  });

  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}

/* ── Check Current Authenticated Session ── */
function checkAuthSession() {
  var storedUser = localStorage.getItem('voyager_user');
  if (storedUser && authState.token) {
    try {
      authState.user = JSON.parse(storedUser);
    } catch (e) {
      authState.user = null;
    }
  }

  if (authState.token) {
    fetch(apiUrl('/api/auth/me'), {
      headers: {
        Authorization: 'Bearer ' + authState.token,
      },
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Session expired');
        return res.json();
      })
      .then(function (userData) {
        authState.user = userData;
        localStorage.setItem('voyager_user', JSON.stringify(userData));
        notifyAuthChange();
      })
      .catch(function () {
        // Token expired or invalid
        logout(true);
      });
  } else {
    updateNavAuthUI();
  }
}

/* ── Notify React nav of auth changes via custom event ── */
function notifyAuthChange() {
  window.dispatchEvent(new CustomEvent('voyager:auth-change'));
}

/* ── Update Navigation Bar Auth Elements ── */
function updateNavAuthUI() {
  // Auth UI is now handled by React (GlobalNav.jsx) via the voyager:auth-change event.
  // This function is kept as a no-op for backward compatibility.
  notifyAuthChange();
}

/* ── Open / Close Auth Modal ── */
function openAuthModal(tab) {
  tab = tab || 'login';
  var modal = document.getElementById('auth-modal');
  if (!modal) return;

  switchAuthTab(tab);
  clearAuthErrors();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  var modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function switchAuthTab(tab) {
  var loginTab = document.getElementById('tab-btn-login');
  var regTab = document.getElementById('tab-btn-register');
  var loginForm = document.getElementById('form-login');
  var regForm = document.getElementById('form-register');
  clearAuthErrors();

  if (tab === 'register') {
    if (regTab) regTab.classList.add('active');
    if (loginTab) loginTab.classList.remove('active');
    if (regForm) regForm.classList.add('active');
    if (loginForm) loginForm.classList.remove('active');
  } else {
    if (loginTab) loginTab.classList.add('active');
    if (regTab) regTab.classList.remove('active');
    if (loginForm) loginForm.classList.add('active');
    if (regForm) regForm.classList.remove('active');
  }
}

function showAuthError(msg) {
  var errBox = document.getElementById('auth-error-msg');
  if (errBox) {
    errBox.textContent = msg;
    errBox.classList.add('show');
  }
}

function clearAuthErrors() {
  var errBox = document.getElementById('auth-error-msg');
  if (errBox) {
    errBox.textContent = '';
    errBox.classList.remove('show');
  }
}

/* ── API Auth Actions ── */
function login(email, password, callback) {
  clearAuthErrors();
  var submitBtn = document.querySelector('#form-login button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
  }

  fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) throw new Error(data.message || 'Login failed');
        return data;
      });
    })
    .then(function (data) {
      authState.user = data;
      authState.token = data.token;
      localStorage.setItem('voyager_token', data.token);
      localStorage.setItem('voyager_user', JSON.stringify(data));

      notifyAuthChange();
      closeAuthModal();
      showToast('Welcome back, ' + data.name + '! 👋', 'success');

      if (typeof callback === 'function') callback(null, data);
    })
    .catch(function (err) {
      showAuthError(err.message);
      if (typeof callback === 'function') callback(err);
    })
    .finally(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In to Voyagers';
      }
    });
}

function register(name, email, password, callback) {
  clearAuthErrors();
  var submitBtn = document.querySelector('#form-register button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
  }

  fetch(apiUrl('/api/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, email: email, password: password }),
  })
    .then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        return data;
      });
    })
    .then(function (data) {
      authState.user = data;
      authState.token = data.token;
      localStorage.setItem('voyager_token', data.token);
      localStorage.setItem('voyager_user', JSON.stringify(data));

      notifyAuthChange();
      closeAuthModal();
      showToast('Account created! Welcome to NextGen Voyagers ✈️', 'success');

      if (typeof callback === 'function') callback(null, data);
    })
    .catch(function (err) {
      showAuthError(err.message);
      if (typeof callback === 'function') callback(err);
    })
    .finally(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    });
}

function demoLogin() {
  login('demo@voyagers.com', 'password123');
}

function logout(silent) {
  authState.user = null;
  authState.token = null;
  localStorage.removeItem('voyager_token');
  localStorage.removeItem('voyager_user');

  notifyAuthChange();
  if (!silent) {
    showToast('Logged out successfully.', 'info');
  }
}

window.logout = logout;

/* ── Init Auth Bindings on DOM Load ── */
document.addEventListener('DOMContentLoaded', function () {
  checkAuthSession();

  // Tab switching
  var tabLogin = document.getElementById('tab-btn-login');
  var tabReg = document.getElementById('tab-btn-register');
  if (tabLogin) tabLogin.addEventListener('click', function () { switchAuthTab('login'); });
  if (tabReg) tabReg.addEventListener('click', function () { switchAuthTab('register'); });

  // Close modal
  var closeBtn = document.getElementById('auth-modal-close');
  var modalOverlay = document.getElementById('auth-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeAuthModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeAuthModal();
    });
  }

  // Password toggle
  document.querySelectorAll('.form-input-toggle-pw').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-target');
      var input = document.getElementById(targetId);
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.textContent = 'Hide';
        } else {
          input.type = 'password';
          btn.textContent = 'Show';
        }
      }
    });
  });

  // Form submits
  var formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('login-email').value.trim();
      var pass = document.getElementById('login-password').value;
      if (!email || !pass) {
        showAuthError('Please fill in all fields');
        return;
      }
      login(email, pass);
    });
  }

  var formRegister = document.getElementById('form-register');
  if (formRegister) {
    formRegister.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('reg-name').value.trim();
      var email = document.getElementById('reg-email').value.trim();
      var pass = document.getElementById('reg-password').value;
      if (!name || !email || !pass) {
        showAuthError('Please fill in all fields');
        return;
      }
      if (pass.length < 6) {
        showAuthError('Password must be at least 6 characters');
        return;
      }
      register(name, email, pass);
    });
  }

  // Demo Login Buttons (kept for backward compat but buttons are removed from UI)
  document.querySelectorAll('.btn-demo-quick').forEach(function (btn) {
    btn.addEventListener('click', function () {
      demoLogin();
    });
  });
});

/* Expose on window so React components can call these without import coupling */
window.openAuthModal  = openAuthModal;
window.closeAuthModal = closeAuthModal;

