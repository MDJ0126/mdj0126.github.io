(function () {
    // 갤러리별 현재 슬라이드 번호
    const state = {};

    function getEls(index) {
        const container = document.getElementById("gallery-container-" + index);
        if (!container) return null;
        return {
            container: container,
            track: container.querySelector(".gallerys"),
            items: container.querySelectorAll(".gallery-item"),
            prev: container.querySelector(".prev-button"),
            next: container.querySelector(".next-button"),
        };
    }

    // 양 끝에서 더 갈 수 없는 방향의 화살표 숨김
    function updateArrows(index) {
        const els = getEls(index);
        if (!els) return;
        const pos = state[index] || 0;
        const max = els.items.length - 1;
        if (els.prev) els.prev.classList.toggle("nav-hidden", pos <= 0);
        if (els.next) els.next.classList.toggle("nav-hidden", pos >= max);
    }

    // 현재 슬라이드의 유튜브만 재생, 나머지는 정지
    function updateMedia(index) {
        const els = getEls(index);
        if (!els) return;
        const pos = state[index] || 0;
        els.items.forEach((item, i) => {
            const iframe = item.querySelector("iframe");
            if (iframe && iframe.contentWindow) {
                const func = i === pos ? "playVideo" : "pauseVideo";
                iframe.contentWindow.postMessage(
                    JSON.stringify({ event: "command", func: func, args: [] }), "*"
                );
            }
            // 폴백 <video> 도 현재 슬라이드만 재생, 나머지 정지
            const video = item.querySelector("video");
            if (video) {
                if (i === pos) { const p = video.play(); if (p) p.catch(() => {}); }
                else video.pause();
            }
        });
    }

    function render(index, animate) {
        const els = getEls(index);
        if (!els) return;
        const pos = state[index] || 0;
        els.track.style.transition = animate ? "transform 0.3s ease-in-out" : "none";
        els.track.style.transform = "translateX(-" + pos * 100 + "%)";
        updateMedia(index);
        updateArrows(index);
    }

    // 순환 없이 양 끝에서 멈춤 (버튼·드래그 공통)
    function goToSlide(index, target) {
        const els = getEls(index);
        if (!els) return;
        const max = els.items.length - 1;
        state[index] = Math.max(0, Math.min(target, max));
        render(index, true);
    }

    // 인라인 onclick에서 호출 (전역)
    window.nextSlide = function (index) {
        index = Number(index);
        goToSlide(index, (state[index] || 0) + 1);
    };
    window.prevSlide = function (index) {
        index = Number(index);
        goToSlide(index, (state[index] || 0) - 1);
    };

    // ── 드래그(스와이프) — 이미지 슬라이드에서만, 유튜브 제외 ──
    let drag = null;
    let suppressClick = false;
    const MOVE_THRESHOLD = 5;   // 드래그로 판정할 최소 이동량(px)
    const SLIDE_THRESHOLD = 40; // 슬라이드를 넘기는 최소 이동량(px)

    document.addEventListener("pointerdown", (e) => {
        if (e.button && e.button !== 0) return;
        const track = e.target.closest(".gallerys");
        if (!track || e.target.closest(".youtube-container")) return;

        const container = e.target.closest(".gallery-container");
        if (!container) return;
        const items = container.querySelectorAll(".gallery-item");
        if (items.length <= 1) return;

        const index = Number(container.id.replace("gallery-container-", ""));
        drag = {
            index: index,
            track: track,
            startX: e.clientX,
            slideWidth: items[0].offsetWidth,
            base: state[index] || 0,
            count: items.length,
            moved: false,
        };
        track.style.transition = "none";
    });

    document.addEventListener("pointermove", (e) => {
        if (!drag) return;
        let delta = e.clientX - drag.startX;
        if (Math.abs(delta) > MOVE_THRESHOLD) drag.moved = true;

        // 양 끝에선 저항감
        const atEdge = (drag.base === 0 && delta > 0) || (drag.base === drag.count - 1 && delta < 0);
        if (atEdge) delta *= 0.3;

        drag.track.style.transform = "translateX(" + (-(drag.base * drag.slideWidth) + delta) + "px)";
    });

    function endDrag(e) {
        if (!drag) return;
        const delta = e.clientX - drag.startX;

        let target = drag.base;
        if (delta <= -SLIDE_THRESHOLD) target = drag.base + 1;
        else if (delta >= SLIDE_THRESHOLD) target = drag.base - 1;

        goToSlide(drag.index, target);

        if (drag.moved) {
            suppressClick = true; // 드래그 직후 클릭(모달 오픈) 무시
            setTimeout(() => { suppressClick = false; }, 0);
        }
        drag = null;
    }

    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", endDrag);

    document.addEventListener("click", (e) => {
        if (suppressClick) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);

    // 이미지 기본 드래그(고스트) 방지
    document.addEventListener("dragstart", (e) => {
        if (e.target.closest(".gallerys")) e.preventDefault();
    });

    // 갤러리 로드 후 초기 상태(화살표 표시 등) 설정
    function initGalleries() {
        document.querySelectorAll(".gallery-container").forEach((c) => {
            const index = Number(c.id.replace("gallery-container-", ""));
            if (!Number.isNaN(index)) render(index, false);
        });
    }
    document.addEventListener("DOMContentLoaded", initGalleries);
    document.addEventListener("postsloaded", initGalleries); // loadPost로 뒤늦게 삽입된 갤러리
})();
