function formatDate(input, targetElement) {
    if (!/^\d{8}$/.test(input)) {
        return "잘못된 형식입니다.";
    }

    const year = input.substring(0, 4);
    const month = parseInt(input.substring(4, 6), 10); // 01 -> 1 변환
    const day = parseInt(input.substring(6, 8), 10);   // 06 -> 6 변환

    targetElement.innerHTML = `${year}년 ${month}월 ${day}일`;
}