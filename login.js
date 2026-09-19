"use strict";

/*
 * =========================================================
 * CR3CKA SECURITY
 * Futuristic Login Controller
 *
 * IMPORTANT:
 * This file handles the login UI and client-side validation.
 *
 * REAL authentication MUST be performed by your backend.
 * Never store plaintext passwords in frontend JavaScript.
 * =========================================================
 */


// =========================================================
// HELPERS
// =========================================================

const $ = (selector) => document.querySelector(selector);

const delay = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));


// =========================================================
// ELEMENTS
// =========================================================

const form = $("#login-form");

const identityInput = $("#login-identity");
const passwordInput = $("#login-password");

const rememberInput = $("#login-remember");

const submitButton = $("#login-submit");

const googleButton = $("#google-login");

const passwordToggle = $("#toggle-login-password");

const statusBox = $("#login-status");


// =========================================================
// STATUS SYSTEM
// =========================================================

function setStatus(message, type = "info") {

    statusBox.textContent = message;

    statusBox.className = `status ${type}`;
}


// =========================================================
// IDENTITY VALIDATION
// =========================================================

function validateIdentity(value) {

    const identity = value.trim();

    if (!identity) {
        return "IDENTITY FIELD REQUIRED";
    }

    if (identity.length < 3) {
        return "IDENTITY TOO SHORT";
    }

    return null;
}


// =========================================================
// PASSWORD VALIDATION
// =========================================================

function validatePassword(value) {

    if (!value) {
        return "ACCESS KEY REQUIRED";
    }

    if (value.length < 8) {
        return "ACCESS KEY MUST CONTAIN 8+ CHARACTERS";
    }

    return null;
}


// =========================================================
// PASSWORD VISIBILITY
// =========================================================

passwordToggle.addEventListener("click", () => {

    const isPassword =
        passwordInput.type === "password";

    passwordInput.type =
        isPassword ? "text" : "password";

    passwordToggle.textContent =
        isPassword ? "HIDE" : "SHOW";

});


// =========================================================
// INPUT FEEDBACK
// =========================================================

identityInput.addEventListener("input", () => {

    if (statusBox.classList.contains("error")) {
        setStatus("");
    }

});


passwordInput.addEventListener("input", () => {

    if (statusBox.classList.contains("error")) {
        setStatus("");
    }

});


// =========================================================
// GOOGLE LOGIN
// =========================================================

googleButton.addEventListener("click", async () => {

    setStatus(
        "INITIALIZING GOOGLE AUTHENTICATION...",
        "info"
    );

    googleButton.disabled = true;

    await delay(700);

    /*
     * =====================================================
     * REAL GOOGLE AUTHENTICATION
     * =====================================================
     *
     * Replace this section with Google Identity Services
     * or your backend OAuth endpoint.
     *
     * Example:
     *
     * window.location.href =
     *     "/api/auth/google";
     *
     * Your backend should then:
     *
     * 1. Start Google OAuth
     * 2. Receive Google's callback
     * 3. Verify the identity server-side
     * 4. Create/login the user
     * 5. Establish a secure session
     *
     * NEVER put a Google Client Secret here.
     */


    setStatus(
        "GOOGLE AUTH READY // OAUTH BACKEND REQUIRED",
        "info"
    );

    googleButton.disabled = false;

});


// =========================================================
// LOGIN PROCESS
// =========================================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const identity =
        identityInput.value.trim();

    const password =
        passwordInput.value;


    // ---------------------------------------------
    // VALIDATE IDENTITY
    // ---------------------------------------------

    const identityError =
        validateIdentity(identity);

    if (identityError) {

        setStatus(
            `✕ ${identityError}`,
            "error"
        );

        identityInput.focus();

        return;
    }


    // ---------------------------------------------
    // VALIDATE PASSWORD
    // ---------------------------------------------

    const passwordError =
        validatePassword(password);

    if (passwordError) {

        setStatus(
            `✕ ${passwordError}`,
            "error"
        );

        passwordInput.focus();

        return;
    }


    // ---------------------------------------------
    // START AUTHENTICATION
    // ---------------------------------------------

    submitButton.disabled = true;

    submitButton.textContent =
        "AUTHENTICATING...";


    setStatus(
        "ESTABLISHING ENCRYPTED SESSION...",
        "info"
    );


    await delay(900);


    /*
     * =====================================================
     * REAL BACKEND LOGIN
     * =====================================================
     *
     * Replace the simulation below with:
     *
     * const response = await fetch("/api/auth/login", {
     *
     *     method: "POST",
     *
     *     headers: {
     *         "Content-Type": "application/json"
     *     },
     *
     *     body: JSON.stringify({
     *         identity,
     *         password,
     *         remember: rememberInput.checked
     *     })
     * });
     *
     * const data = await response.json();
     *
     * if (!response.ok) {
     *     throw new Error(
     *         data.message || "Authentication failed"
     *     );
     * }
     *
     * IMPORTANT:
     * The backend should verify the password against a
     * secure password hash such as Argon2id or bcrypt.
     *
     * Prefer an HttpOnly + Secure + SameSite session cookie
     * instead of storing authentication tokens in localStorage.
     * =====================================================
     */


    // -----------------------------------------------------
    // DEMO RESPONSE
    // -----------------------------------------------------

    await delay(800);


    setStatus(
        "✓ AUTHENTICATION BACKEND NOT CONNECTED",
        "info"
    );


    submitButton.disabled = false;

    submitButton.textContent =
        "INITIALIZE SECURE SESSION";

});


// =========================================================
// FORGOT PASSWORD
// =========================================================

$("#forgot-password").addEventListener("click", (event) => {

    /*
     * Change this URL when your backend recovery system
     * is ready.
     */

    if (
        !event.currentTarget.getAttribute("href") ||
        event.currentTarget.getAttribute("href") === "#"
    ) {

        event.preventDefault();

        setStatus(
            "PASSWORD RECOVERY MODULE OFFLINE",
            "error"
        );

    }

});


// =========================================================
// ENTER / CTRL + ENTER
// =========================================================

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Enter" &&
        event.ctrlKey
    ) {

        form.requestSubmit();

    }

});


// =========================================================
// SECURITY-STYLE BOOT LOG
// =========================================================

console.log(
    "%c CR3CKA SECURITY ",
    "background:#00ff88;color:#00150c;font-weight:bold;padding:5px 10px;"
);

console.log(
    "%c Authentication Gateway initialized.",
    "color:#00ff88;"
);

console.log(
    "%c Secure frontend channel ready.",
    "color:#00eaff;"
);

console.log(
    "%c Backend authentication required for real login.",
    "color:#ffe600;"
);


// =========================================================
// INITIAL STATUS
// =========================================================

setStatus(
    "SYSTEM READY // AWAITING CREDENTIALS",
    "info"
);
