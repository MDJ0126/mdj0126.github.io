document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalInnerImage");
    const closeBtn = document.getElementById("closeBtn");
    if (!modal || !modalImg) return;

    const root = document.documentElement;
    let lockedByMe = false;
    let savedScrollY = 0;

    function lockPage() {
        savedScrollY = window.scrollY || window.pageYOffset || 0;
        root.style.setProperty("--modal-sbw", (window.innerWidth - root.clientWidth) + "px");
        root.classList.add("modal-open");
        document.body.style.position = "fixed";
        document.body.style.top = "-" + savedScrollY + "px";
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";
        lockedByMe = true;
    }

    function unlockPage() {
        if (!lockedByMe) return;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        root.classList.remove("modal-open");
        root.style.removeProperty("--modal-sbw");
        window.scrollTo(0, savedScrollY);
        lockedByMe = false;
    }

    function open(src) {
        modalImg.src = "";
        modalImg.src = src;
        modal.style.display = "flex";
        // 이미 잠겨 있으면(프로젝트 모달 위) 그대로 두고, 아니면 잠금
        if (!root.classList.contains("modal-open")) lockPage();
    }

    function close() {
        modal.style.display = "none";
        unlockPage();
    }

    // 갤러리 이미지(.modal) 클릭 → 확대
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("modal")) open(event.target.src);
    });

    if (closeBtn) closeBtn.addEventListener("click", close);

    // 배경 클릭 시 닫기
    modal.addEventListener("click", (event) => {
        if (event.target === modal) close();
    });
});
