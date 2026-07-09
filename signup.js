/* ==========================================================================
   CR3CKA SECURITY — signup.js
   ========================================================================== */

(function () {
  'use strict';

  const form = document.getElementById('signup-form');
  if (!form) return;

  const nameInput = document.getElementById('signup-name');
  const userInput = document.getElementById('signup-username');
  const emailInput = document.getElementById('signup-email');
  const passInput = document.getElementById('signup-password');
  const confirmInput = document.getElementById('signup-confirm');
  const termsInput = document.getElementById('signup-terms');
  const toggleBtn = document.getElementById('toggle-signup-password');
  const submitBtn = document.getElementById('signup-submit');
  const status = document.getElementById('signup-status');
  const strengthMeter = document.getElementById('strength-meter');
  const strengthLabel = document.getElementById('strength-label');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passInput.type === 'password';
      passInput.type = isPassword ? 'text' : 'password';
      confirmInput.type = isPassword ? 'text' : 'password';
      toggleBtn.innerHTML = isPassword ? eyeOffIcon() : eyeIcon();
    });
  }

  passInput.addEventListener('input', () => {
    const score = scorePassword(passInput.value);
    strengthMeter.className = 'strength-meter s' + score;
    const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
    strengthLabel.textContent = passInput.value ? labels[score] : '';
  });

  function scorePassword(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw) && pw.length >= 10) score++;
    return score;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    valid = validate(nameInput, nameInput.value.trim().length >= 2, 'Enter your full name') && valid;
    valid = validate(userInput, /^[a-zA-Z0-9_]{3,20}$/.test(userInput.value.trim()), '3-20 characters: letters, numbers, underscore') && valid;
    valid = validate(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()), 'Enter a valid email address') && valid;
    valid = validate(passInput, passInput.value.length >= 8, 'Password must be at least 8 characters') && valid;
    valid = validate(confirmInput, confirmInput.value === passInput.value && passInput.value.length > 0, 'Passwords do not match') && valid;

    if (!termsInput.checked) {
      document.getElementById('terms-error').textContent = 'You must accept the Terms to continue';
      valid = false;
    } else {
      document.getElementById('terms-error').textContent = '';
    }

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
      status.textContent = 'Account created — redirecting to sign in…';
      status.className = 'form-status success';
      setTimeout(() => { window.location.href = 'login.html'; }, 1000);
    }, 1200);
  });

  [nameInput, userInput, emailInput, passInput, confirmInput].forEach((el) => {
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
