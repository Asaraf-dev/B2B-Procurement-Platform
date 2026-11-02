
/*--- Component Configuration ---*/
const bpComComponentConfig = [
    {
        selector: "#bp-com-navbar-container",
        file: "assets/components/navbar.html",
        name: "Navbar"
    },
    {
        selector: "#bp-com-footer-container",
        file: "assets/components/footer.html",
        name: "Footer"
    }
];

/*--- Load HTML Component ---*/
async function bpComLoadComponent(bpComComponent) {
    const bpComContainer = document.querySelector(bpComComponent.selector);

    if (!bpComContainer || bpComContainer.dataset.loaded === "true") {
        return;
    }

    bpComContainer.dataset.loaded = "loading";

    try {
        const bpComResponse = await fetch(bpComComponent.file, {
            method: "GET",
            cache: "no-cache"
        });

        if (!bpComResponse.ok) {
            throw new Error(
                "HTTP " + bpComResponse.status + " - " + bpComResponse.statusText
            );
        }

        const bpComHtml = await bpComResponse.text();

        if (!bpComHtml.trim()) {
            throw new Error("The component file is empty.");
        }

        bpComContainer.innerHTML = bpComHtml;
        bpComContainer.dataset.loaded = "true";
        delete bpComContainer.dataset.loadError;

        document.dispatchEvent(
            new CustomEvent("bp:component-loaded", {
                detail: {
                    name: bpComComponent.name,
                    container: bpComContainer
                }
            })
        );
    } catch (bpComError) {
        delete bpComContainer.dataset.loaded;
        bpComContainer.dataset.loadError = "true";

        console.error(
            "Stackly " + bpComComponent.name + " component failed to load:",
            bpComError
        );
    }
}

/*--- Initialize Components ---*/
async function bpComInitComponents() {
    await Promise.all(
        bpComComponentConfig.map(function (bpComComponent) {
            return bpComLoadComponent(bpComComponent);
        })
    );
}

/*--- Components DOM Ready ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpComInitComponents);
} else {
    bpComInitComponents();
}
