"use strict";

/*
 * =========================================================
 * CR3CKA SECURITY
 * LOGIN CONTROLLER
 * =========================================================
 *
 * FRONTEND DEMO AUTHENTICATION
 *
 * IMPORTANT:
 * This validates the form locally.
 * Real password verification must be performed by backend.
 * =========================================================
 */


// =========================================================
// HELPERS
// =========================================================

const $ = (selector) =>
    document.querySelector(selector);

const delay = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));


// =========================================================
// ELEMENTS
// =========================================================

const form = $("#login-form");

const identityInput =
    $("#login-identity");

const passwordInput =
    $("#login-password");

const rememberInput =
    $("#login-remember");

const submitButton =
    $("#login-submit");

const googleButton =
    $("#google-login");

const passwordToggle =
    $("#toggle-login-password");

const statusBox =
    $("#login-status");


// =========================================================
// STATUS
// =========================================================

function setStatus(message, type = "info") {

    statusBox.textContent = message;

    statusBox.className =
        `status ${type}`;
}


// =========================================================
// VALIDATION
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
// PASSWORD SHOW / HIDE
// =========================================================

passwordToggle.addEventListener(
    "click",
    () => {

        const hidden =
            passwordInput.type === "password";

        passwordInput.type =
            hidden ? "text" : "password";

        passwordToggle.textContent =
            hidden ? "HIDE" : "SHOW";
    }
);


// =========================================================
// GOOGLE LOGIN
// =========================================================

googleButton.addEventListener(
    "click",
    async () => {

        setStatus(
            "INITIALIZING GOOGLE AUTHENTICATION...",
            "info"
        );

        googleButton.disabled = true;

        await delay(700);

        /*
         * REAL GOOGLE OAUTH WILL GO HERE.
         *
         * Example:
         *
         * window.location.href =
         *     "/api/auth/google";
         */

        setStatus(
            "GOOGLE OAUTH BACKEND NOT CONNECTED",
            "error"
        );

        googleButton.disabled = false;
    }
);


// =========================================================
// LOGIN
// =========================================================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const identity =
            identityInput.value.trim();

        const password =
            passwordInput.value;


        // -----------------------------------------
        // IDENTITY CHECK
        // -----------------------------------------

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


        // -----------------------------------------
        // PASSWORD CHECK
        // -----------------------------------------

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


// -----------------------------------------
// SUPABASE AUTHENTICATION
// -----------------------------------------

submitButton.disabled = true;
submitButton.textContent = "AUTHENTICATING...";

setStatus(
    "AUTHENTICATING WITH SECURE NODE...",
    "info"
);

try {

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: identity,
            password: password
        });

    if (error) {

        console.error(
            "CR3CKA Supabase login error:",
            error
        );

        setStatus(
            `✕ ${error.message}`,
            "error"
        );

        submitButton.disabled = false;
        submitButton.textContent =
            "INITIALIZE SECURE SESSION";

        return;
    }

    console.log(
        "CR3CKA authenticated user:",
        data.user
    );

    setStatus(
        "✓ ACCESS GRANTED // REDIRECTING...",
        "success"
    );

    submitButton.textContent =
        "ACCESS GRANTED ✓";

    await delay(800);

    window.location.href =
        "./dashboard.html";

} catch (error) {

    console.error(
        "CR3CKA authentication error:",
        error
    );

    setStatus(
        "✕ AUTHENTICATION SYSTEM ERROR",
        "error"
    );

    submitButton.disabled = false;

    submitButton.textContent =
        "INITIALIZE SECURE SESSION";
}

    }
);


// =========================================================
// FORGOT PASSWORD
// =========================================================

const forgotPassword =
    $("#forgot-password");

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        () => {

            /*
             * Replace with your actual
             * password recovery page.
             */

            console.log(
                "Password recovery requested"
            );
        }
    );
}


// =========================================================
// CTRL + ENTER
// =========================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            form.requestSubmit();
        }
    }
);


// =========================================================
// BOOT LOG
// =========================================================

console.log(
    "%c CR3CKA SECURITY ",
    "background:#00ff88;color:#00150c;font-weight:bold;padding:5px 10px;"
);

console.log(
    "%c AUTHENTICATION GATEWAY ONLINE",
    "color:#00ff88;"
);

console.log(
    "%c DASHBOARD REDIRECT ENABLED",
    "color:#00eaff;"
);


// =========================================================
// READY
// =========================================================

setStatus(
    "SYSTEM READY // AWAITING CREDENTIALS",
    "info"
);
