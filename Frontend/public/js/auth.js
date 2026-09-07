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
        updateNavAuthUI();
      })
      .catch(function () {
        // Token expired or invalid
        logout(true);
      });
  } else {
    updateNavAuthUI();
  }
}

/* ── Update Navigation Bar Auth Elements ── */
function updateNavAuthUI() {
  var actionsContainer = document.querySelector('.nav-actions');
  if (!actionsContainer) return;

  if (authState.user && authState.token) {
    var firstName = (authState.user.name || 'Traveler').split(' ')[0];
    var initials = (authState.user.name || 'T')
      .split(' ')
      .map(function (n) { return n[0]; })
      .slice(0, 2)
      .join('')
      .toUpperCase();

    actionsContainer.innerHTML =
      '<div class="nav-user-wrapper" id="nav-user-wrapper">' +
        '<button class="nav-user-pill" id="nav-user-toggle" aria-haspopup="true">' +
          '<div class="user-avatar-badge">' + initials + '</div>' +
          '<span>' + firstName + '</span>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="m6 9 6 6 6-6"/></svg>' +
        '</button>' +
        '<div class="nav-user-dropdown" id="nav-user-dropdown">' +
          '<div class="dropdown-user-info">' +
            '<div class="dropdown-user-name">' + (authState.user.name || 'Traveler') + '</div>' +
            '<div class="dropdown-user-email">' + (authState.user.email || '') + '</div>' +
          '</div>' +
          '<button class="dropdown-item" id="nav-drop-dashboard">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:16px;height:16px"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>' +
            'My Dashboard' +
          '</button>' +
          '<button class="dropdown-item" id="nav-drop-trips">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:16px;height:16px"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>' +
            'Saved Itineraries' +
          '</button>' +
          '<button class="dropdown-item danger-item" id="nav-drop-logout">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:16px;height:16px"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>' +
            'Log Out' +
          '</button>' +
        '</div>' +
      '</div>';

    // Bind dropdown events
    var toggleBtn = document.getElementById('nav-user-toggle');
    var dropdown = document.getElementById('nav-user-dropdown');

    if (toggleBtn && dropdown) {
      toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('show');
      });

      document.addEventListener('click', function (e) {
        if (!e.target.closest('#nav-user-wrapper')) {
          dropdown.classList.remove('show');
        }
      });
    }

    var btnDash = document.getElementById('nav-drop-dashboard');
    if (btnDash) {
      btnDash.addEventListener('click', function () {
        dropdown.classList.remove('show');
        openDashboardModal();
      });
    }

    var btnTrips = document.getElementById('nav-drop-trips');
    if (btnTrips) {
      btnTrips.addEventListener('click', function () {
        dropdown.classList.remove('show');
        openDashboardModal('trips');
      });
    }

    var btnLogout = document.getElementById('nav-drop-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', function () {
        dropdown.classList.remove('show');
        logout();
      });
    }
  } else {
    // Logged-out default view
    actionsContainer.innerHTML =
      '<button class="nav-btn-login" id="nav-btn-login">Log in</button>' +
      '<button class="nav-btn-signup" id="nav-btn-signup" data-cta="start-planning">Start Planning</button>';

    var loginBtn = document.getElementById('nav-btn-login');
    if (loginBtn) {
      loginBtn.addEventListener('click', function () {
        openAuthModal('login');
      });
    }

    var signupBtn = document.getElementById('nav-btn-signup');
    if (signupBtn) {
      signupBtn.addEventListener('click', function (e) {
        var plannerEl = document.getElementById('planner-section');
        if (plannerEl) {
          plannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }
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

      updateNavAuthUI();
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

      updateNavAuthUI();
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

  updateNavAuthUI();
  if (!silent) {
    showToast('Logged out successfully.', 'info');
  }
}

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

  // Demo Login Buttons
  document.querySelectorAll('.btn-demo-quick').forEach(function (btn) {
    btn.addEventListener('click', function () {
      demoLogin();
    });
  });
});
