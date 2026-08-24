function initializeCompanyToggles() {
    document.querySelectorAll(".company .company-box-container").forEach((company, index) => {
        if (company.dataset.companyToggleReady === "true") return;

        const header = company.querySelector(".title-container");
        const content = company.querySelector(".content-container");
        if (!header || !content) return;

        const contentId = content.id || `company-content-${index + 1}`;
        content.id = contentId;

        header.setAttribute("role", "button");
        header.setAttribute("tabindex", "0");
        header.setAttribute("aria-controls", contentId);
        header.setAttribute("aria-expanded", "false");

        company.classList.add("is-collapsed");
        content.style.height = "0px";
        company.dataset.companyToggleReady = "true";

        content.addEventListener("transitionend", event => {
            if (event.propertyName !== "height") return;
            if (!company.classList.contains("is-collapsed")) {
                content.style.height = "auto";
            }
        });

        const closeCompany = targetCompany => {
            if (targetCompany.classList.contains("is-collapsed")) return;

            const targetHeader = targetCompany.querySelector(".title-container");
            const targetContent = targetCompany.querySelector(".content-container");
            if (!targetHeader || !targetContent) return;

            targetContent.style.height = `${targetContent.scrollHeight}px`;
            targetContent.offsetHeight;
            targetCompany.classList.add("is-collapsed");
            targetHeader.setAttribute("aria-expanded", "false");
            requestAnimationFrame(() => {
                targetContent.style.height = "0px";
            });
        };

        const openCompany = () => {
            content.style.height = "0px";
            company.classList.remove("is-collapsed");
            header.setAttribute("aria-expanded", "true");
            requestAnimationFrame(() => {
                content.style.height = `${content.scrollHeight}px`;
            });
        };

        const toggle = () => {
            if (company.classList.contains("is-collapsed")) {
                const group = company.closest(".companys");
                if (group) {
                    group.querySelectorAll(".company .company-box-container").forEach(otherCompany => {
                        if (otherCompany !== company) closeCompany(otherCompany);
                    });
                }

                openCompany();
                return;
            }

            closeCompany(company);
        };

        header.addEventListener("click", toggle);
        header.addEventListener("keydown", event => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            toggle();
        });
    });
}

document.addEventListener("DOMContentLoaded", initializeCompanyToggles);
document.addEventListener("postsloaded", initializeCompanyToggles);
window.addEventListener("resize", () => {
    document.querySelectorAll(".company .company-box-container:not(.is-collapsed) .content-container").forEach(content => {
        content.style.height = "auto";
    });
});
