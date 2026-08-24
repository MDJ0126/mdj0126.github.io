// 유튜브 영상이 사라졌으면(썸네일 없음) 리포지토리 영상으로 대체
(function () {
    function swap(container, src) {
        container.innerHTML = '<video src="' + src + '" controls playsinline preload="none"></video>';
    }

    function check(container) {
        if (container.dataset.fbChecked) return;
        container.dataset.fbChecked = "1";

        const id = container.dataset.videoId;
        const fallback = container.dataset.fallback;
        if (!id || !fallback) return;

        const img = new Image();
        img.onload = function () {
            // 삭제된 영상은 회색 기본 썸네일(120x90)이 오므로 그것도 없음으로 간주
            if (img.naturalWidth <= 120) swap(container, fallback);
        };
        img.onerror = function () {
            swap(container, fallback);
        };
        img.src = "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg";
    }

    function scan() {
        document
            .querySelectorAll(".youtube-container[data-video-id][data-fallback]")
            .forEach(check);
    }

    document.addEventListener("DOMContentLoaded", scan);
    document.addEventListener("postsloaded", scan); // loadPost로 뒤늦게 삽입된 영상
})();
