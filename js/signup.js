"use strict";

/*
 * CR3CKA SECURITY
 * Futuristic Signup Controller
 *
 * NOTE:
 * This file handles client-side validation and UI.
 * Real account creation must be performed by your backend.
 */

const $ = (selector) => document.querySelector(selector);

/* -----------------------------------------
   ELEMENTS
----------------------------------------- */

const form = $("#signup-form");

const nameInput = $("#signup-name");
const usernameInput = $("#signup-username");
const emailInput = $("#signup-email");
const passwordInput = $("#signup-password");
const confirmInput = $("#signup-confirm");

const termsInput = $("#signup-terms");

const submitButton = $("#signup-submit");

const statusBox = $("#signup-status");

const googleButton = $("#google-signup");

const passwordToggle = $("#toggle-signup-password");

const strengthMeter = $("#strength-meter");
const strengthLabel = $("#strength-label");

/* -----------------------------------------
   ERROR ELEMENTS
----------------------------------------- */

const errors = {
    name: $("#signup-name-error"),
    username: $("#signup-username-error"),
    email: $("#signup-email-error"),
    password: $("#signup-password-error"),
    confirm: $("#signup-confirm-error"),
    terms: $("#terms-error")
};

/* -----------------------------------------
   UTILITY
----------------------------------------- */

function setError(element, message) {
    if (element) {
        element.textContent = message || "";
    }
}

function clearErrors() {

    Object.values(errors).forEach((element) => {
        if (element) {
            element.textContent = "";
        }
    });

    statusBox.textContent = "";
    statusBox.className = "form-status";
}

function setStatus(message, type = "") {

    statusBox.textContent = message;
    statusBox.className = `form-status ${type}`;
}

/* -----------------------------------------
   USERNAME
----------------------------------------- */

function validateUsername(username) {

    if (!username) {
        return "Username is required.";
    }

    if (username.length < 3) {
        return "Minimum 3 characters required.";
    }

    if (username.length > 24) {
        return "Maximum 24 characters allowed.";
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
        return "Use only letters, numbers, _, - or .";
    }

    return "";
}

/* -----------------------------------------
   EMAIL
----------------------------------------- */

function validateEmail(email) {

    if (!email) {
        return "Email address is required.";
    }

    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!pattern.test(email)) {
        return "Enter a valid email address.";
    }

    return "";
}

/* -----------------------------------------
   PASSWORD
----------------------------------------- */

function getPasswordScore(password) {

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    if (/[A-Z]/.test(password)) score++;

    if (/[a-z]/.test(password)) score++;

    if (/[0-9]/.test(password)) score++;

    if (/[^A-Za-z0-9]/.test(password)) score++;

    return Math.min(4, Math.ceil(score / 1.5));
}

function updatePasswordStrength() {

    const password = passwordInput.value;

    const segments =
        strengthMeter.querySelectorAll(".seg");

    segments.forEach((segment) => {

        segment.style.background = "#16242b";
        segment.style.boxShadow = "none";

    });

    if (!password) {

        strengthLabel.textContent = "";

        return;
    }

    const score = getPasswordScore(password);

    let label = "";

    if (score === 1) {
        label = "VERY WEAK";
    }

    if (score === 2) {
        label = "WEAK";
    }

    if (score === 3) {
        label = "STRONG";
    }

    if (score === 4) {
        label = "FORTRESS";
    }

    strengthLabel.textContent =
        `PASSWORD SECURITY // ${label}`;

    for (let i = 0; i < score; i++) {

        segments[i].style.background =
            "linear-gradient(90deg,#00ff88,#00d9ff)";

        segments[i].style.boxShadow =
            "0 0 8px rgba(0,255,136,.5)";
    }
}

passwordInput.addEventListener(
    "input",
    updatePasswordStrength
);

/* -----------------------------------------
   PASSWORD VISIBILITY
----------------------------------------- */

passwordToggle.addEventListener(
    "click",
    () => {

        const visible =
            passwordInput.type === "text";

        passwordInput.type =
            visible ? "password" : "text";

        passwordToggle.textContent =
            visible ? "◉" : "◎";
    }
);

/* -----------------------------------------
   FORM VALIDATION
----------------------------------------- */

function validateForm() {

    clearErrors();

    let valid = true;

    const name =
        nameInput.value.trim();

    const username =
        usernameInput.value.trim();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    const confirm =
        confirmInput.value;

    /* NAME */

    if (!name) {

        setError(
            errors.name,
            "Full name is required."
        );

        valid = false;
    }

    /* USERNAME */

    const usernameError =
        validateUsername(username);

    if (usernameError) {

        setError(
            errors.username,
            usernameError
        );

        valid = false;
    }

    /* EMAIL */

    const emailError =
        validateEmail(email);

    if (emailError) {

        setError(
            errors.email,
            emailError
        );

        valid = false;
    }

    /* PASSWORD */

    if (!password) {

        setError(
            errors.password,
            "Password is required."
        );

        valid = false;

    } else if (password.length < 8) {

        setError(
            errors.password,
            "Password must contain at least 8 characters."
        );

        valid = false;
    }

    /* CONFIRM */

    if (!confirm) {

        setError(
            errors.confirm,
            "Confirm your password."
        );

        valid = false;

    } else if (password !== confirm) {

        setError(
            errors.confirm,
            "Passwords do not match."
        );

        valid = false;
    }

    /* TERMS */

    if (!termsInput.checked) {

        setError(
            errors.terms,
            "Accept the Terms & Privacy Policy."
        );

        valid = false;
    }

    return valid;
}

/* -----------------------------------------
   FORM SUBMIT
----------------------------------------- */

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        if (!validateForm()) {

            setStatus(
                "ACCESS DENIED // CHECK INPUT PARAMETERS",
                "error"
            );

            return;
        }

        submitButton.classList.add("loading");

        submitButton.disabled = true;

        setStatus(
            "INITIALIZING SECURE IDENTITY..."
        );

        try {

            /*
             * IMPORTANT:
             *
             * Replace this simulation with your backend API:
             *
             * const response = await fetch("/api/auth/signup", {
             *     method: "POST",
             *     headers: {
             *         "Content-Type": "application/json"
             *     },
             *     body: JSON.stringify({
             *         name,
             *         username,
             *         email,
             *         password
             *     })
             * });
             *
             * Never store raw passwords in frontend/localStorage.
             */

            await delay(1300);

            setStatus(
                "IDENTITY CREATED // REDIRECTING...",
                "success"
            );

            /*
             * Demo redirect.
             * Change this after connecting your backend.
             */

            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1200);

        } catch (error) {

            console.error(
                "CR3CKA signup error:",
                error
            );

            setStatus(
                "SYSTEM ERROR // REQUEST FAILED",
                "error"
            );

            submitButton.disabled = false;
            submitButton.classList.remove("loading");
        }
    }
);

/* -----------------------------------------
   GOOGLE SIGNUP
----------------------------------------- */

googleButton.addEventListener(
    "click",
    () => {

        setStatus(
            "GOOGLE AUTH // INITIALIZING OAUTH CHANNEL..."
        );

        /*
         * This is the UI integration point.
         *
         * For production:
         *
         * 1. Configure Google OAuth / Google Identity Services.
         * 2. Obtain your Google Client ID.
         * 3. Send the Google credential to your backend.
         * 4. Verify the credential server-side.
         * 5. Create/login the user server-side.
         *
         * Do NOT trust a client-side email/name as proof
         * of authentication.
         */

        setTimeout(() => {

            setStatus(
                "GOOGLE AUTH READY // CONNECT OAUTH BACKEND",
                "success"
            );

        }, 900);
    }
);

/* -----------------------------------------
   THEME TOGGLE
----------------------------------------- */

const themeToggle =
    $("#theme-toggle");

let lightMode = false;

themeToggle.addEventListener(
    "click",
    () => {

        lightMode = !lightMode;

        if (lightMode) {

            document.body.style.background =
                "#eef5f3";

            document.documentElement.style
                .setProperty(
                    "--text",
                    "#07120d"
                );

            themeToggle.textContent = "☾";

        } else {

            document.body.style.background =
                "#030609";

            document.documentElement.style
                .setProperty(
                    "--text",
                    "#eafff6"
                );

            themeToggle.textContent = "◐";
        }
    }
);

/* -----------------------------------------
   TERMINAL-STYLE INPUT FEEDBACK
----------------------------------------- */

[
    nameInput,
    usernameInput,
    emailInput,
    passwordInput,
    confirmInput
].forEach((input) => {

    input.addEventListener(
        "focus",
        () => {

            setStatus(
                `INPUT CHANNEL // ${input.id.toUpperCase()}`
            );

        }
    );

});

/* -----------------------------------------
   KEYBOARD SHORTCUT
----------------------------------------- */

document.addEventListener(
    "keydown",
    (event) => {

        /*
         * Ctrl + Enter
         * submits signup form.
         */

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            form.requestSubmit();
        }
    }
);

/* -----------------------------------------
   HELPER
----------------------------------------- */

function delay(milliseconds) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );
}

/* -----------------------------------------
   INITIAL BOOT
----------------------------------------- */

console.log(
    "%c[ CR3CKA SECURITY ]",
    "color:#00ff88;font-weight:bold;font-size:16px"
);

console.log(
    "%cSECURE AUTHENTICATION NODE INITIALIZED",
    "color:#00d9ff"
);
```
