/*--- Hero Section Start ---*/
function bpIndInitHero() {
    const bpIndHeroVisual = document.querySelector(".bp-ind-hero-visual");
    const bpIndHeroImage = document.querySelector(".bp-ind-hero-image");
    const bpIndReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const bpIndFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (!bpIndHeroVisual || !bpIndHeroImage || bpIndReducedMotion.matches || !bpIndFinePointer.matches) {
        return;
    }

    /*--- Subtle Image Parallax ---*/
    bpIndHeroVisual.addEventListener("pointermove", function (bpIndEvent) {
        const bpIndBounds = bpIndHeroVisual.getBoundingClientRect();
        const bpIndX = (bpIndEvent.clientX - bpIndBounds.left) / bpIndBounds.width - 0.5;
        const bpIndY = (bpIndEvent.clientY - bpIndBounds.top) / bpIndBounds.height - 0.5;

        bpIndHeroImage.style.transform = "scale(1.07) translate(" + (bpIndX * -5) + "px, " + (bpIndY * -5) + "px)";
    });

    bpIndHeroVisual.addEventListener("pointerleave", function () {
        bpIndHeroImage.style.transform = "";
    });
}
/*--- Home Hero DOM Ready ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpIndInitHero);
} else {
    bpIndInitHero();
}
/*--- Hero Section End ---*/
