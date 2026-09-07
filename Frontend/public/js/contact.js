'use strict';

/* ============================================================
   VOYAGER — Contact Page & Support Module
   Handles contact form submission, validation, subject tags,
   and async communication with /api/contact endpoint.
   ============================================================ */

function initContact() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var nameInput    = document.getElementById('contact-name');
  var emailInput   = document.getElementById('contact-email');
  var subjectInput = document.getElementById('contact-subject');
  var messageInput = document.getElementById('contact-message');
  var submitBtn    = document.getElementById('contact-submit-btn');
  var statusBox    = document.getElementById('contact-status');
  var subjectChips = document.querySelectorAll('.contact-subject-chip');

  // Quick subject chips
  subjectChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      subjectChips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      var subjectVal = chip.getAttribute('data-subject');
      if (subjectInput && subjectVal) {
        subjectInput.value = subjectVal;
      }
    });
  });

  // Pre-fill name and email if user is logged in
  if (typeof authState !== 'undefined' && authState.user) {
    if (nameInput && !nameInput.value) nameInput.value = authState.user.name || '';
    if (emailInput && !emailInput.value) emailInput.value = authState.user.email || '';
  }

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name    = (nameInput ? nameInput.value : '').trim();
    var email   = (emailInput ? emailInput.value : '').trim();
    var subject = (subjectInput ? subjectInput.value : '').trim();
    var message = (messageInput ? messageInput.value : '').trim();

    if (!name || !email || !subject || !message) {
      if (typeof showToast === 'function') {
        showToast('Please fill out all fields in the contact form.', 'error');
      }
      showStatus('Please fill in all required fields.', 'err');
      return;
    }

    // Set sending UI
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<div class="spinner-sm" style="display:inline-block;vertical-align:middle;margin-right:8px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;width:14px;height:14px;animation:spin 0.8s linear infinite;"></div> Sending Message…';
    }

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message
      })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Submission failed');
        return res.json();
      })
      .then(function (data) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Message Sent! ✓';
          submitBtn.classList.add('btn-sent');
        }

        form.reset();
        subjectChips.forEach(function (c) { c.classList.remove('active'); });

        showStatus('Thank you! Your message has been received. Our travel support team will get back to you within 2-4 hours.', 'success');

        if (typeof showToast === 'function') {
          showToast('Your message has been sent successfully! 🚀', 'success');
        }

        setTimeout(function () {
          if (submitBtn) {
            submitBtn.innerHTML = 'Send Message ' + (typeof icon === 'function' ? icon('arrow') : '→');
            submitBtn.classList.remove('btn-sent');
          }
        }, 5000);
      })
      .catch(function (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message ' + (typeof icon === 'function' ? icon('arrow') : '→');
        }

        showStatus('Unable to send message right now. Please call our 24/7 helpline or try again.', 'err');

        if (typeof showToast === 'function') {
          showToast('Failed to send message. Please try again.', 'error');
        }
      });
  });

  function showStatus(msg, type) {
    if (!statusBox) return;
    statusBox.textContent = msg;
    statusBox.className = 'contact-status-box ' + type;
    statusBox.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', initContact);
