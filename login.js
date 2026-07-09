/* ==========================================================================
   CR3CKA SECURITY — login.js
   ========================================================================== */

(function () {
  'use strict';

  const form = document.getElementById('login-form');
  if (!form) return;

  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  const toggleBtn = document.getElementById('toggle-login-password');
  const submitBtn = document.getElementById('login-submit');
  const status = document.getElementById('login-status');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passInput.type === 'password';
      passInput.type = isPassword ? 'text' : 'password';
      toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      toggleBtn.innerHTML = isPassword ? eyeOffIcon() : eyeIcon();
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    valid = validate(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()), 'Enter a valid email address') && valid;
    valid = validate(passInput, passInput.value.length >= 8, 'Password must be at least 8 characters') && valid;

    if (!valid) {
      status.textContent = 'Please correct the errors above.';
      status.className = 'form-status error';
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    status.textContent = '';

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      status.textContent = 'Signed in successfully. Redirecting to your dashboard…';
      status.className = 'form-status success';
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
    }, 1200);
  });

  [emailInput, passInput].forEach((el) => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
  });

  function validate(input, condition, message) {
    const errEl = document.getElementById(input.id + '-error');
    input.classList.toggle('invalid', !condition);
    input.classList.toggle('valid', condition);
    if (errEl) errEl.textContent = condition ? '' : message;
    return condition;
  }

  function eyeIcon() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }
  function eyeOffIcon() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.9 17.9A10.9 10.9 0 0112 20c-7 0-11-8-11-8a19.5 19.5 0 015.1-6.2M9.9 4.2A10.6 10.6 0 0112 4c7 0 11 8 11 8a19.6 19.6 0 01-3.3 4.4M14.1 14.1a3 3 0 11-4.2-4.2"/><path d="M1 1l22 22"/></svg>';
  }
})();
