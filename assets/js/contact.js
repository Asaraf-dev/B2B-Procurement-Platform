/*--- Get in Touch / Contact Form Section Start ---*/
function bpConInitContactForm() {
    const bpConForm = document.getElementById("bp-con-inquiry-form");
    const bpConName = document.getElementById("bp-con-name");
    const bpConPhone = document.getElementById("bp-con-phone");
    const bpConPopup = document.getElementById("bp-con-success-popup");
    const bpConClose = document.getElementById("bp-con-success-close");
    const bpConOk = document.getElementById("bp-con-success-ok");

    if (!bpConForm || !bpConName || !bpConPhone || !bpConPopup) {
        return;
    }

    /*--- Name: Allow Alphabets And Spaces Only ---*/
    bpConName.addEventListener("input", function () {
        const bpConCursor = bpConName.selectionStart;
        const bpConOldValue = bpConName.value;
        bpConName.value = bpConName.value.replace(/[^a-zA-Z\s'-]/g, "");

        if (bpConName.value !== bpConOldValue) {
            const bpConNewCursor = Math.max(0, bpConCursor - (bpConOldValue.length - bpConName.value.length));
            bpConName.setSelectionRange(bpConNewCursor, bpConNewCursor);
        }
    });

    /*--- Phone: Allow Numbers Only And Maximum 10 Digits ---*/
    bpConPhone.addEventListener("input", function () {
        bpConPhone.value = bpConPhone.value.replace(/\D/g, "").slice(0, 10);
    });

    /*--- Open Success Popup ---*/
    function bpConOpenSuccessPopup() {
        bpConPopup.classList.add("bp-con-success-active");
        bpConPopup.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        if (bpConClose) {
            bpConClose.focus();
        }
    }

    /*--- Close Success Popup ---*/
    function bpConCloseSuccessPopup() {
        bpConPopup.classList.remove("bp-con-success-active");
        bpConPopup.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        bpConForm.reset();
    }

    /*--- Form Submit ---*/
    bpConForm.addEventListener("submit", function (bpConEvent) {
        bpConEvent.preventDefault();

        if (!bpConForm.checkValidity()) {
            bpConForm.reportValidity();
            return;
        }

        bpConOpenSuccessPopup();
    });

    /*--- Close Popup Buttons ---*/
    if (bpConClose) {
        bpConClose.addEventListener("click", bpConCloseSuccessPopup);
    }

    if (bpConOk) {
        bpConOk.addEventListener("click", bpConCloseSuccessPopup);
    }

    /*--- Close Popup On Background Click ---*/
    bpConPopup.addEventListener("click", function (bpConEvent) {
        if (bpConEvent.target === bpConPopup) {
            bpConCloseSuccessPopup();
        }
    });

    /*--- Close Popup With Escape Key ---*/
    document.addEventListener("keydown", function (bpConEvent) {
        if (bpConEvent.key === "Escape" &&
            bpConPopup.classList.contains("bp-con-success-active")) {
            bpConCloseSuccessPopup();
        }
    });
}

/*--- Initialize Contact Form ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpConInitContactForm);
} else {
    bpConInitContactForm();
}
/*--- Get in Touch / Contact Form Section End ---*/

/*--- FAQ Section Start ---*/
function bpConFaqInit() {
    const bpConFaqLists = document.querySelectorAll("[data-bp-faq]");

    bpConFaqLists.forEach(function (bpConFaqList) {
        if (bpConFaqList.dataset.initialized === "true") {
            return;
        }

        bpConFaqList.dataset.initialized = "true";

        const bpConFaqItems = bpConFaqList.querySelectorAll(".bp-con-faq-item");

        bpConFaqItems.forEach(function (bpConFaqItem) {
            const bpConFaqButton = bpConFaqItem.querySelector(".bp-con-faq-question");

            if (!bpConFaqButton) {
                return;
            }

            bpConFaqButton.addEventListener("click", function () {
                const bpConFaqIsActive = bpConFaqItem.classList.contains("bp-con-faq-active");

                bpConFaqItems.forEach(function (bpConFaqOtherItem) {
                    bpConFaqOtherItem.classList.remove("bp-con-faq-active");

                    const bpConFaqOtherButton = bpConFaqOtherItem.querySelector(".bp-con-faq-question");

                    if (bpConFaqOtherButton) {
                        bpConFaqOtherButton.setAttribute("aria-expanded", "false");
                    }
                });

                if (!bpConFaqIsActive) {
                    bpConFaqItem.classList.add("bp-con-faq-active");
                    bpConFaqButton.setAttribute("aria-expanded", "true");
                }
            });
        });
    });
}

/*--- Initialize Contact FAQ ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpConFaqInit);
} else {
    bpConFaqInit();
}
/*--- FAQ Section End ---*/