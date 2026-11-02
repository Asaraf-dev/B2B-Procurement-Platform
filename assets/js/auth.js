
/*--- Stackly Login Initialization ---*/
function bpAuthLoginInit() {
    const bpAuthLoginForm = document.getElementById("bp-auth-login-form");

    if (!bpAuthLoginForm || bpAuthLoginForm.dataset.initialized === "true") {
        return;
    }

    bpAuthLoginForm.dataset.initialized = "true";

    const bpAuthEmail = document.getElementById("bp-auth-login-email");
    const bpAuthPassword = document.getElementById("bp-auth-login-password");
    const bpAuthRemember = document.getElementById("bp-auth-remember");
    const bpAuthPasswordToggle = document.getElementById("bp-auth-password-toggle");
    const bpAuthSubmit = document.getElementById("bp-auth-login-submit");
    const bpAuthMessage = document.getElementById("bp-auth-login-message");
    const bpAuthRoleError = document.getElementById("bp-auth-role-error");
    const bpAuthEmailError = document.getElementById("bp-auth-email-error");
    const bpAuthPasswordError = document.getElementById("bp-auth-password-error");
    const bpAuthYear = document.getElementById("bp-auth-login-year");

    /*--- Copyright Year ---*/
    if (bpAuthYear) {
        bpAuthYear.textContent = new Date().getFullYear();
    }

    /*--- Restore Remembered Email ---*/
    const bpAuthSavedEmail = localStorage.getItem("bpAuthRememberedEmail");

    if (bpAuthSavedEmail) {
        bpAuthEmail.value = bpAuthSavedEmail;
        bpAuthRemember.checked = true;
    }

    /*--- Password Visibility Toggle ---*/
    bpAuthPasswordToggle.addEventListener("click", function () {
        const bpAuthIsPassword = bpAuthPassword.type === "password";

        bpAuthPassword.type = bpAuthIsPassword ? "text" : "password";
        bpAuthPasswordToggle.innerHTML = bpAuthIsPassword
            ? '<i class="bi bi-eye-slash"></i>'
            : '<i class="bi bi-eye"></i>';

        bpAuthPasswordToggle.setAttribute(
            "aria-label",
            bpAuthIsPassword ? "Hide password" : "Show password"
        );

        bpAuthPasswordToggle.setAttribute(
            "aria-pressed",
            bpAuthIsPassword ? "true" : "false"
        );
    });

    /*--- Clear Field Error ---*/
    function bpAuthClearError(bpAuthElement, bpAuthErrorElement) {
        bpAuthElement.classList.remove("bp-auth-login-invalid");
        bpAuthErrorElement.textContent = "";
        bpAuthErrorElement.classList.remove("bp-auth-login-error-show");
    }

    /*--- Show Field Error ---*/
    function bpAuthShowError(bpAuthElement, bpAuthErrorElement, bpAuthText) {
        bpAuthElement.classList.add("bp-auth-login-invalid");
        bpAuthErrorElement.textContent = bpAuthText;
        bpAuthErrorElement.classList.add("bp-auth-login-error-show");
    }

    /*--- Clear General Message ---*/
    function bpAuthClearMessage() {
        bpAuthMessage.textContent = "";
        bpAuthMessage.classList.remove("bp-auth-login-message-show");
    }

    /*--- Show General Message ---*/
    function bpAuthShowMessage(bpAuthText) {
        bpAuthMessage.textContent = bpAuthText;
        bpAuthMessage.classList.add("bp-auth-login-message-show");
    }

    /*--- Email Validation ---*/
    function bpAuthValidateEmail() {
        const bpAuthEmailValue = bpAuthEmail.value.trim();

        if (!bpAuthEmailValue) {
            bpAuthShowError(
                bpAuthEmail.parentElement,
                bpAuthEmailError,
                "Please enter your email address."
            );
            return false;
        }

        if (!bpAuthEmail.validity.valid) {
            bpAuthShowError(
                bpAuthEmail.parentElement,
                bpAuthEmailError,
                "Please enter a valid email address."
            );
            return false;
        }

        bpAuthClearError(bpAuthEmail.parentElement, bpAuthEmailError);
        return true;
    }

    /*--- Password Validation ---*/
    function bpAuthValidatePassword() {
        if (!bpAuthPassword.value.trim()) {
            bpAuthShowError(
                bpAuthPassword.parentElement,
                bpAuthPasswordError,
                "Please enter your password."
            );
            return false;
        }

        bpAuthClearError(bpAuthPassword.parentElement, bpAuthPasswordError);
        return true;
    }

    /*--- Role Validation ---*/
    function bpAuthValidateRole() {
        const bpAuthSelectedRole = bpAuthLoginForm.querySelector(
            'input[name="accountType"]:checked'
        );

        if (!bpAuthSelectedRole) {
            bpAuthRoleError.textContent = "Please select Admin or Client.";
            bpAuthRoleError.classList.add("bp-auth-login-error-show");
            return false;
        }

        bpAuthRoleError.textContent = "";
        bpAuthRoleError.classList.remove("bp-auth-login-error-show");
        return true;
    }

    /*--- Live Validation ---*/
    bpAuthEmail.addEventListener("input", function () {
        bpAuthClearMessage();

        if (bpAuthEmail.value.trim()) {
            bpAuthValidateEmail();
        } else {
            bpAuthClearError(bpAuthEmail.parentElement, bpAuthEmailError);
        }
    });

    bpAuthPassword.addEventListener("input", function () {
        bpAuthClearMessage();

        if (bpAuthPassword.value.trim()) {
            bpAuthValidatePassword();
        } else {
            bpAuthClearError(bpAuthPassword.parentElement, bpAuthPasswordError);
        }
    });

    bpAuthLoginForm.querySelectorAll('input[name="accountType"]').forEach(function (bpAuthRole) {
        bpAuthRole.addEventListener("change", function () {
            bpAuthRoleError.textContent = "";
            bpAuthRoleError.classList.remove("bp-auth-login-error-show");
            bpAuthClearMessage();
        });
    });

    /*--- Login Form Submission ---*/
    bpAuthLoginForm.addEventListener("submit", function (bpAuthEvent) {
        bpAuthEvent.preventDefault();
        bpAuthClearMessage();

        const bpAuthRoleValid = bpAuthValidateRole();
        const bpAuthEmailValid = bpAuthValidateEmail();
        const bpAuthPasswordValid = bpAuthValidatePassword();

        if (!bpAuthRoleValid || !bpAuthEmailValid || !bpAuthPasswordValid) {
            if (!bpAuthRoleValid) {
                bpAuthLoginForm.querySelector('input[name="accountType"]').focus();
            } else if (!bpAuthEmailValid) {
                bpAuthEmail.focus();
            } else {
                bpAuthPassword.focus();
            }

            return;
        }

        const bpAuthSelectedRole = bpAuthLoginForm.querySelector(
            'input[name="accountType"]:checked'
        ).value;

        const bpAuthEmailValue = bpAuthEmail.value.trim().toLowerCase();

        /*--- Store Login Information ---*/
        sessionStorage.setItem("bpAuthUserEmail", bpAuthEmailValue);
        sessionStorage.setItem("bpAuthUserRole", bpAuthSelectedRole);
        sessionStorage.setItem("bpAuthLoginStatus", "true");

        /*--- Remember Email ---*/
        if (bpAuthRemember.checked) {
            localStorage.setItem("bpAuthRememberedEmail", bpAuthEmailValue);
        } else {
            localStorage.removeItem("bpAuthRememberedEmail");
        }

        /*--- Redirect Based On Account Type ---*/
        bpAuthSubmit.disabled = true;
        bpAuthSubmit.innerHTML = '<span>Signing in...</span><i class="bi bi-arrow-repeat"></i>';

        if (bpAuthSelectedRole === "admin") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "client-dashboard.html";
        }
    });
}

/*--- Initialize Login Page ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpAuthLoginInit);
} else {
    bpAuthLoginInit();
}




/*--- Stackly Register Initialization ---*/
function bpAuthRegisterInit() {
    const bpAuthRegisterForm = document.getElementById("bp-auth-register-form");

    if (!bpAuthRegisterForm || bpAuthRegisterForm.dataset.initialized === "true") {
        return;
    }

    bpAuthRegisterForm.dataset.initialized = "true";

    const bpAuthName = document.getElementById("bp-auth-register-name");
    const bpAuthPhone = document.getElementById("bp-auth-register-phone");
    const bpAuthEmail = document.getElementById("bp-auth-register-email");
    const bpAuthPassword = document.getElementById("bp-auth-register-password");
    const bpAuthConfirmPassword = document.getElementById("bp-auth-register-confirm-password");
    const bpAuthSubmit = document.getElementById("bp-auth-register-submit");
    const bpAuthMessage = document.getElementById("bp-auth-register-message");
    const bpAuthRoleError = document.getElementById("bp-auth-register-role-error");
    const bpAuthNameError = document.getElementById("bp-auth-register-name-error");
    const bpAuthPhoneError = document.getElementById("bp-auth-register-phone-error");
    const bpAuthEmailError = document.getElementById("bp-auth-register-email-error");
    const bpAuthPasswordError = document.getElementById("bp-auth-register-password-error");
    const bpAuthConfirmError = document.getElementById("bp-auth-register-confirm-error");
    const bpAuthYear = document.getElementById("bp-auth-register-year");

    /*--- Copyright Year ---*/
    if (bpAuthYear) {
        bpAuthYear.textContent = new Date().getFullYear();
    }

    /*--- Field Error Helpers ---*/
    function bpAuthRegisterShowError(bpAuthField, bpAuthError, bpAuthText) {
        bpAuthField.classList.add("bp-auth-login-invalid");
        bpAuthError.textContent = bpAuthText;
        bpAuthError.classList.add("bp-auth-login-error-show");
    }

    function bpAuthRegisterClearError(bpAuthField, bpAuthError) {
        bpAuthField.classList.remove("bp-auth-login-invalid");
        bpAuthError.textContent = "";
        bpAuthError.classList.remove("bp-auth-login-error-show");
    }

    function bpAuthRegisterShowMessage(bpAuthText) {
        bpAuthMessage.textContent = bpAuthText;
        bpAuthMessage.classList.add("bp-auth-login-message-show");
    }

    function bpAuthRegisterClearMessage() {
        bpAuthMessage.textContent = "";
        bpAuthMessage.classList.remove("bp-auth-login-message-show");
    }

    /*--- Password Visibility ---*/
    function bpAuthRegisterTogglePassword(bpAuthInput, bpAuthButton, bpAuthLabel) {
        if (!bpAuthButton || !bpAuthInput) {
            return;
        }

        bpAuthButton.addEventListener("click", function () {
            const bpAuthIsPassword = bpAuthInput.type === "password";

            bpAuthInput.type = bpAuthIsPassword ? "text" : "password";
            bpAuthButton.innerHTML = bpAuthIsPassword
                ? '<i class="bi bi-eye-slash"></i>'
                : '<i class="bi bi-eye"></i>';

            bpAuthButton.setAttribute(
                "aria-label",
                bpAuthIsPassword ? "Hide " + bpAuthLabel : "Show " + bpAuthLabel
            );

            bpAuthButton.setAttribute(
                "aria-pressed",
                bpAuthIsPassword ? "true" : "false"
            );
        });
    }

    bpAuthRegisterTogglePassword(
        bpAuthPassword,
        document.getElementById("bp-auth-register-password-toggle"),
        "password"
    );

    bpAuthRegisterTogglePassword(
        bpAuthConfirmPassword,
        document.getElementById("bp-auth-register-confirm-toggle"),
        "confirm password"
    );

    /*--- Full Name Input Restriction ---*/
    bpAuthName.addEventListener("input", function () {
        const bpAuthCleanName = bpAuthName.value.replace(/[^A-Za-z\s]/g, "");

        if (bpAuthName.value !== bpAuthCleanName) {
            bpAuthName.value = bpAuthCleanName;
        }

        bpAuthRegisterClearMessage();

        if (bpAuthName.value.trim()) {
            bpAuthRegisterValidateName();
        } else {
            bpAuthRegisterClearError(bpAuthName.parentElement, bpAuthNameError);
        }
    });

    /*--- Phone Number Input Restriction ---*/
    bpAuthPhone.addEventListener("input", function () {
        const bpAuthCleanPhone = bpAuthPhone.value.replace(/\D/g, "").slice(0, 10);

        if (bpAuthPhone.value !== bpAuthCleanPhone) {
            bpAuthPhone.value = bpAuthCleanPhone;
        }

        bpAuthRegisterClearMessage();

        if (bpAuthPhone.value) {
            bpAuthRegisterValidatePhone();
        } else {
            bpAuthRegisterClearError(bpAuthPhone.parentElement, bpAuthPhoneError);
        }
    });

    /*--- Name Validation ---*/
    function bpAuthRegisterValidateName() {
        const bpAuthNameValue = bpAuthName.value.trim();

        if (!bpAuthNameValue) {
            bpAuthRegisterShowError(
                bpAuthName.parentElement,
                bpAuthNameError,
                "Please enter your full name."
            );
            return false;
        }

        if (!/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(bpAuthNameValue)) {
            bpAuthRegisterShowError(
                bpAuthName.parentElement,
                bpAuthNameError,
                "Name can contain letters and spaces only."
            );
            return false;
        }

        bpAuthRegisterClearError(bpAuthName.parentElement, bpAuthNameError);
        return true;
    }

    /*--- Phone Validation ---*/
    function bpAuthRegisterValidatePhone() {
        const bpAuthPhoneValue = bpAuthPhone.value.trim();

        if (!bpAuthPhoneValue) {
            bpAuthRegisterShowError(
                bpAuthPhone.parentElement,
                bpAuthPhoneError,
                "Please enter your phone number."
            );
            return false;
        }

        if (!/^[0-9]{10}$/.test(bpAuthPhoneValue)) {
            bpAuthRegisterShowError(
                bpAuthPhone.parentElement,
                bpAuthPhoneError,
                "Phone number must contain exactly 10 digits."
            );
            return false;
        }

        bpAuthRegisterClearError(bpAuthPhone.parentElement, bpAuthPhoneError);
        return true;
    }

    /*--- Email Validation ---*/
    function bpAuthRegisterValidateEmail() {
        const bpAuthEmailValue = bpAuthEmail.value.trim();

        if (!bpAuthEmailValue) {
            bpAuthRegisterShowError(
                bpAuthEmail.parentElement,
                bpAuthEmailError,
                "Please enter your email address."
            );
            return false;
        }

        if (!bpAuthEmail.validity.valid) {
            bpAuthRegisterShowError(
                bpAuthEmail.parentElement,
                bpAuthEmailError,
                "Please enter a valid email address."
            );
            return false;
        }

        bpAuthRegisterClearError(bpAuthEmail.parentElement, bpAuthEmailError);
        return true;
    }

    /*--- Password Requirement Validation ---*/
    function bpAuthRegisterCheckPasswordRules(bpAuthValue) {
        return {
            length: bpAuthValue.length >= 8,
            uppercase: /[A-Z]/.test(bpAuthValue),
            lowercase: /[a-z]/.test(bpAuthValue),
            number: /[0-9]/.test(bpAuthValue),
            special: /[^A-Za-z0-9\s]/.test(bpAuthValue)
        };
    }

    /*--- Update Password Requirement Indicators ---*/
    function bpAuthRegisterUpdatePasswordRules() {
        const bpAuthRules = bpAuthRegisterCheckPasswordRules(bpAuthPassword.value);
        const bpAuthRuleElements = document.querySelectorAll(
            "#bp-auth-register-password-rules [data-rule]"
        );

        bpAuthRuleElements.forEach(function (bpAuthRuleElement) {
            const bpAuthRuleName = bpAuthRuleElement.dataset.rule;
            const bpAuthIsValid = bpAuthRules[bpAuthRuleName];
            const bpAuthIcon = bpAuthRuleElement.querySelector("i");

            bpAuthRuleElement.classList.toggle("bp-auth-rule-valid", bpAuthIsValid);
            bpAuthRuleElement.classList.toggle(
                "bp-auth-rule-invalid",
                bpAuthPassword.value.length > 0 && !bpAuthIsValid
            );

            if (bpAuthIcon) {
                bpAuthIcon.className = bpAuthIsValid
                    ? "bi bi-check-circle-fill"
                    : "bi bi-circle";
            }
        });

        return Object.values(bpAuthRules).every(Boolean);
    }

    /*--- Password Validation ---*/
    function bpAuthRegisterValidatePassword() {
        const bpAuthPasswordValue = bpAuthPassword.value;

        if (!bpAuthPasswordValue) {
            bpAuthRegisterShowError(
                bpAuthPassword.parentElement,
                bpAuthPasswordError,
                "Please create a password."
            );
            return false;
        }

        if (!bpAuthRegisterUpdatePasswordRules()) {
            bpAuthRegisterShowError(
                bpAuthPassword.parentElement,
                bpAuthPasswordError,
                "Your password Must Contain at least 8 characters with an uppercase letter, lowercase letter, number and special character."
            );
            return false;
        }

        bpAuthRegisterClearError(bpAuthPassword.parentElement, bpAuthPasswordError);
        return true;
    }

    /*--- Confirm Password Validation ---*/
    function bpAuthRegisterValidateConfirmPassword() {
        if (!bpAuthConfirmPassword.value) {
            bpAuthRegisterShowError(
                bpAuthConfirmPassword.parentElement,
                bpAuthConfirmError,
                "Please confirm your password."
            );
            return false;
        }

        if (bpAuthConfirmPassword.value !== bpAuthPassword.value) {
            bpAuthRegisterShowError(
                bpAuthConfirmPassword.parentElement,
                bpAuthConfirmError,
                "Passwords do not match."
            );
            return false;
        }

        bpAuthRegisterClearError(
            bpAuthConfirmPassword.parentElement,
            bpAuthConfirmError
        );
        return true;
    }

    /*--- Account Role Validation ---*/
    function bpAuthRegisterValidateRole() {
        const bpAuthSelectedRole = bpAuthRegisterForm.querySelector(
            'input[name="registerAccountType"]:checked'
        );

        if (!bpAuthSelectedRole) {
            bpAuthRoleError.textContent = "Please select Admin or Client.";
            bpAuthRoleError.classList.add("bp-auth-login-error-show");
            return false;
        }

        bpAuthRoleError.textContent = "";
        bpAuthRoleError.classList.remove("bp-auth-login-error-show");
        return true;
    }

    /*--- Live Password Validation ---*/
    bpAuthPassword.addEventListener("input", function () {
        bpAuthRegisterClearMessage();
        bpAuthRegisterUpdatePasswordRules();

        if (bpAuthPassword.value) {
            bpAuthRegisterValidatePassword();
        } else {
            bpAuthRegisterClearError(
                bpAuthPassword.parentElement,
                bpAuthPasswordError
            );
        }

        if (bpAuthConfirmPassword.value) {
            bpAuthRegisterValidateConfirmPassword();
        }
    });

    /*--- Live Confirm Password Validation ---*/
    bpAuthConfirmPassword.addEventListener("input", function () {
        bpAuthRegisterClearMessage();

        if (bpAuthConfirmPassword.value) {
            bpAuthRegisterValidateConfirmPassword();
        } else {
            bpAuthRegisterClearError(
                bpAuthConfirmPassword.parentElement,
                bpAuthConfirmError
            );
        }
    });

    /*--- Live Email Validation ---*/
    bpAuthEmail.addEventListener("input", function () {
        bpAuthRegisterClearMessage();

        if (bpAuthEmail.value.trim()) {
            bpAuthRegisterValidateEmail();
        } else {
            bpAuthRegisterClearError(
                bpAuthEmail.parentElement,
                bpAuthEmailError
            );
        }
    });

    /*--- Role Selection Validation ---*/
    bpAuthRegisterForm.querySelectorAll(
        'input[name="registerAccountType"]'
    ).forEach(function (bpAuthRole) {
        bpAuthRole.addEventListener("change", function () {
            bpAuthRoleError.textContent = "";
            bpAuthRoleError.classList.remove("bp-auth-login-error-show");
            bpAuthRegisterClearMessage();
        });
    });

    /*--- Register Form Submission ---*/
    bpAuthRegisterForm.addEventListener("submit", function (bpAuthEvent) {
        bpAuthEvent.preventDefault();
        bpAuthRegisterClearMessage();

        const bpAuthRoleValid = bpAuthRegisterValidateRole();
        const bpAuthNameValid = bpAuthRegisterValidateName();
        const bpAuthPhoneValid = bpAuthRegisterValidatePhone();
        const bpAuthEmailValid = bpAuthRegisterValidateEmail();
        const bpAuthPasswordValid = bpAuthRegisterValidatePassword();
        const bpAuthConfirmValid = bpAuthRegisterValidateConfirmPassword();

        if (
            !bpAuthRoleValid ||
            !bpAuthNameValid ||
            !bpAuthPhoneValid ||
            !bpAuthEmailValid ||
            !bpAuthPasswordValid ||
            !bpAuthConfirmValid
        ) {
            if (!bpAuthRoleValid) {
                bpAuthRegisterForm.querySelector(
                    'input[name="registerAccountType"]'
                ).focus();
            } else if (!bpAuthNameValid) {
                bpAuthName.focus();
            } else if (!bpAuthPhoneValid) {
                bpAuthPhone.focus();
            } else if (!bpAuthEmailValid) {
                bpAuthEmail.focus();
            } else if (!bpAuthPasswordValid) {
                bpAuthPassword.focus();
            } else {
                bpAuthConfirmPassword.focus();
            }

            return;
        }

        const bpAuthSelectedRole = bpAuthRegisterForm.querySelector(
            'input[name="registerAccountType"]:checked'
        ).value;

        const bpAuthProfile = {
            name: bpAuthName.value.trim().replace(/\s+/g, " "),
            phone: bpAuthPhone.value.trim(),
            email: bpAuthEmail.value.trim().toLowerCase(),
            role: bpAuthSelectedRole
        };

        /*--- Store Profile Details ---*/
        try {
            localStorage.setItem(
                "bpAuthProfile",
                JSON.stringify(bpAuthProfile)
            );
        } catch (bpAuthStorageError) {
            bpAuthRegisterShowMessage(
                "Unable to save your profile details in this browser. Please check your browser storage settings."
            );
            return;
        }

        /*--- Clear Previous Login Session ---*/
        sessionStorage.removeItem("bpAuthUserEmail");
        sessionStorage.removeItem("bpAuthUserRole");
        sessionStorage.removeItem("bpAuthLoginStatus");

        /*--- Redirect To Login ---*/
        bpAuthSubmit.disabled = true;
        bpAuthSubmit.innerHTML =
            '<span>Account Created</span><i class="bi bi-check-circle"></i>';

        window.location.href = "login.html";
    });
}

/*--- Initialize Register Page ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpAuthRegisterInit);
} else {
    bpAuthRegisterInit();
}
