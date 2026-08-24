function initializeCertificationToggles() {
    document.querySelectorAll(".cert-list").forEach(list => {
        if (list.dataset.certToggleReady === "true") return;

        list.querySelectorAll(".cert-item").forEach((item, index) => {
            const button = item.querySelector(".cert-summary");
            const detail = item.querySelector(".cert-detail");
            if (!button || !detail) return;

            const detailId = detail.id || `cert-detail-${index + 1}`;
            detail.id = detailId;
            button.setAttribute("aria-controls", detailId);
            detail.style.height = "0px";

            detail.addEventListener("transitionend", event => {
                if (event.propertyName !== "height") return;
                if (detail.classList.contains("is-open")) {
                    detail.style.height = "auto";
                }
            });

            button.addEventListener("click", () => {
                const isOpen = detail.classList.contains("is-open");

                list.querySelectorAll(".cert-item").forEach(otherItem => {
                    const otherButton = otherItem.querySelector(".cert-summary");
                    const otherDetail = otherItem.querySelector(".cert-detail");
                    if (!otherButton || !otherDetail || otherDetail === detail) return;
                    if (!otherDetail.classList.contains("is-open")) return;

                    otherDetail.style.height = `${otherDetail.scrollHeight}px`;
                    otherDetail.offsetHeight;
                    otherDetail.classList.remove("is-open");
                    otherButton.setAttribute("aria-expanded", "false");
                    requestAnimationFrame(() => {
                        otherDetail.style.height = "0px";
                    });
                });

                if (isOpen) {
                    detail.style.height = `${detail.scrollHeight}px`;
                    detail.offsetHeight;
                    detail.classList.remove("is-open");
                    button.setAttribute("aria-expanded", "false");
                    requestAnimationFrame(() => {
                        detail.style.height = "0px";
                    });
                    return;
                }

                detail.style.height = "0px";
                detail.classList.add("is-open");
                button.setAttribute("aria-expanded", "true");
                requestAnimationFrame(() => {
                    detail.style.height = `${detail.scrollHeight}px`;
                });
            });
        });

        list.dataset.certToggleReady = "true";
    });
}

document.addEventListener("DOMContentLoaded", initializeCertificationToggles);
