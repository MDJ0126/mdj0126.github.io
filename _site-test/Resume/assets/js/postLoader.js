window.__pendingPosts = 0;

function loadPost(url, targetId) {
    window.__pendingPosts++;
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const target = document.getElementById(targetId);
            target.innerHTML = html;

            // 동적으로 로드된 스크립트를 실행하기 위한 추가 작업
            const scripts = target.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.type = 'text/javascript';

                // 내부 스크립트는 textContent로 추가
                if (!script.src) {
                    newScript.textContent = script.textContent;
                } else {  // 외부 스크립트는 src 속성으로 추가
                    newScript.src = script.src;
                }

                // 스크립트를 실행하려면 body에 삽입
                document.body.appendChild(newScript);
                document.body.removeChild(newScript);  // 실행 후 제거
            });
        })
        .catch(error => console.error('Error loading post:', error))
        .finally(() => {
            window.__pendingPosts--;
            if (window.__pendingPosts <= 0) {
                document.dispatchEvent(new Event('postsloaded'));
            }
        });
}
