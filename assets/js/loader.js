
/*--- Loader Elements ---*/
const bpLdrLoader = document.getElementById("bp-ldr-loader");
const bpLdrMessage = document.getElementById("bp-ldr-message");
const bpLdrParticles = document.getElementById("bp-ldr-particles");
const bpLdrMessages = [
    "Connecting your business...",
    "Bringing procurement into focus...",
    "Preparing smarter workflows...",
    "Organizing your supply network...",
    "Building better business connections..."
];
let bpLdrMessageIndex = 0;
let bpLdrMessageInterval = null;
let bpLdrExitTimeout = null;
let bpLdrMessageTimeout = null;
let bpLdrStartTime = Date.now();
const bpLdrMinimumTime = 1000;

/*--- Create Loader Particles ---*/
function bpLdrCreateParticles() {
    if (!bpLdrParticles || bpLdrParticles.children.length > 0) {
        return;
    }
    const bpLdrFragment = document.createDocumentFragment();
    for (let bpLdrIndex = 0; bpLdrIndex < 30; bpLdrIndex++) {
        const bpLdrParticle = document.createElement("span");
        bpLdrParticle.className = "bp-ldr-particle";
        bpLdrParticle.style.left = Math.random() * 100 + "%";
        bpLdrParticle.style.top = Math.random() * 100 + "%";
        const bpLdrSize = 2 + Math.random() * 3;
        bpLdrParticle.style.width = bpLdrSize + "px";
        bpLdrParticle.style.height = bpLdrSize + "px";
        bpLdrParticle.style.animationDelay = Math.random() * 5 + "s";
        bpLdrParticle.style.animationDuration = 4 + Math.random() * 5 + "s";
        bpLdrFragment.appendChild(bpLdrParticle);
    }
    bpLdrParticles.appendChild(bpLdrFragment);
}

/*--- Start Loader Messages ---*/
function bpLdrStartMessages() {
    clearInterval(bpLdrMessageInterval);
    clearTimeout(bpLdrMessageTimeout);
    bpLdrMessageIndex = 0;
    if (!bpLdrMessage) {
        return;
    }
    bpLdrMessage.textContent = bpLdrMessages[0];
    bpLdrMessage.style.opacity = "1";
    bpLdrMessage.style.transform = "translateY(0)";
    bpLdrMessageInterval = setInterval(function () {
        bpLdrMessageIndex = (bpLdrMessageIndex + 1) % bpLdrMessages.length;
        bpLdrMessage.style.opacity = "0";
        bpLdrMessage.style.transform = "translateY(5px)";
        bpLdrMessageTimeout = setTimeout(function () {
            if (!bpLdrMessage) {
                return;
            }
            bpLdrMessage.textContent = bpLdrMessages[bpLdrMessageIndex];
            bpLdrMessage.style.opacity = "1";
            bpLdrMessage.style.transform = "translateY(0)";
        }, 250);
    }, 1500);
}

/*--- Show Loader ---*/
function bpLdrShowLoader() {
    if (!bpLdrLoader) {
        return;
    }
    clearTimeout(bpLdrExitTimeout);
    bpLdrLoader.classList.remove("bp-ldr-hidden", "bp-ldr-exit");
    bpLdrLoader.setAttribute("aria-hidden", "false");
    bpLdrCreateParticles();
    bpLdrStartMessages();
}

/*--- Hide Loader ---*/
function bpLdrHideLoader() {
    if (!bpLdrLoader) {
        return;
    }
    clearInterval(bpLdrMessageInterval);
    clearTimeout(bpLdrMessageTimeout);
    bpLdrLoader.classList.add("bp-ldr-exit");
    bpLdrLoader.setAttribute("aria-hidden", "true");
    bpLdrExitTimeout = setTimeout(function () {
        if (bpLdrLoader) {
            bpLdrLoader.classList.add("bp-ldr-hidden");
        }
    }, 700);
}

/*--- Initialize Loader ---*/
function bpLdrInit() {
    if (!bpLdrLoader) {
        return;
    }
    bpLdrCreateParticles();
    bpLdrStartMessages();
    if (document.readyState === "complete") {
        bpLdrHideLoader();
    }
}

/*--- Initial Page Load ---*/
if (bpLdrLoader) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bpLdrInit, { once: true });
    } else {
        bpLdrInit();
    }
}

/*--- Window Loaded ---*/
window.addEventListener("load", function () {
    const bpLdrElapsedTime = Date.now() - bpLdrStartTime;
    const bpLdrRemainingTime = Math.max(0, bpLdrMinimumTime - bpLdrElapsedTime);
    setTimeout(function () {
        bpLdrHideLoader();
    }, bpLdrRemainingTime);
});

/*--- Browser Back And Forward ---*/
window.addEventListener("pageshow", function (bpLdrEvent) {
    if (bpLdrEvent.persisted && bpLdrLoader) {
        bpLdrShowLoader();
        requestAnimationFrame(function () {
            requestAnimationFrame(bpLdrHideLoader);
        });
    }
});

/*--- Mouse Glow ---*/
document.addEventListener("mousemove", function (bpLdrEvent) {
    if (!bpLdrLoader || bpLdrLoader.classList.contains("bp-ldr-hidden")) {
        return;
    }
    bpLdrLoader.style.setProperty("--bp-ldr-x", bpLdrEvent.clientX + "px");
    bpLdrLoader.style.setProperty("--bp-ldr-y", bpLdrEvent.clientY + "px");
});
