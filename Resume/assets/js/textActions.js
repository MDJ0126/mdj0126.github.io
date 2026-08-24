function copyToClipboard(element) {
    const text = element.innerText || element.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast(`"${text}" 복사되었습니다`);
    }).catch(err => {
        console.error('복사 실패:', err);
        showToast('복사에 실패했습니다');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".copy").forEach(element => {
        element.setAttribute("onclick", "copyToClipboard(this)");
        element.innerHTML += '<div class="copy-icon"></div>';
    });
});

function search(element) {
    const query = encodeURIComponent(element.innerText || element.textContent);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".search").forEach(element => {
        element.setAttribute("onclick", "search(this)");
        element.innerHTML += '<div class="search-icon"></div>';
    });
});