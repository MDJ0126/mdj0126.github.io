function parseDateFromString(dateString) {
    var match = dateString.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (!match) {
        console.error('올바르지 않은 날짜 형식입니다.');
        return null;
    }
    var year = parseInt(match[1], 10);
    var month = parseInt(match[2], 10) - 1; // JavaScript의 month는 0부터 시작
    var day = parseInt(match[3], 10);
    var dateObject = new Date(year, month, day);
    return isNaN(dateObject.getTime()) ? null : dateObject;
}

function parseDateAndDisplayFromString(dateString, targetElement) {
    var dateObject = parseDateFromString(dateString);
    var dateObjectString = `${dateObject.getFullYear()}년 ${dateObject.getMonth() + 1}월`;
    targetElement.innerHTML = isNaN(dateObject.getTime()) ? null : dateObjectString;
}

function calculateExperience(startDate, endDate = null, includeStartMonth = false) {
    var startDateObject = parseDateFromString(startDate);
    var endDateObject = endDate ? parseDateFromString(endDate) : new Date();

    if (startDateObject === null || endDateObject === null) return null;

    var years = endDateObject.getFullYear() - startDateObject.getFullYear();
    var months = endDateObject.getMonth() - startDateObject.getMonth();

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    if (includeStartMonth) {
        months += 1;
        if (months === 12) {
            years += 1;
            months = 0;
        }
    }

    return { years, months };
}

// 경력 계산
function calculateAndDisplayExperience(startDate, endDateOrElement, targetElement = null) {
    // 끝 날짜가 주어진 경우 (두 번째 경력의 예시)
    if (endDateOrElement && typeof endDateOrElement === 'string') {
        var experience = calculateExperience(startDate, endDateOrElement, true);
        if (experience !== null && targetElement) {
            targetElement.innerHTML = `${experience.years}년 ${experience.months}개월`;
        }
    }
    // targetElement만 있는 경우 기존 방식
    else if (endDateOrElement && targetElement === null) {
        var experience = calculateExperience(startDate, null, true);
        if (experience !== null && endDateOrElement) {
            endDateOrElement.innerHTML = `${experience.years}년 ${experience.months}개월`;
        }
    }
}

// 나이 계산
function calculateAndDisplayAge(startDate, targetElement) {
    var experience = calculateExperience(startDate);
    if (experience !== null && targetElement) {
        targetElement.innerHTML = `${experience.years}세`;
    }
}

// 페이지 로드시 모든 span에 대해 자동 실행
window.onload = function () {
    document.querySelectorAll("span[onload]").forEach(el => {
        var params = el.getAttribute("onload").match(/'([^']+)'/g).map(param => param.replace(/'/g, ''));
        if (params.length === 2) {
            calculateAndDisplayExperience(params[0], params[1], el);
        } else {
            calculateAndDisplayExperience(params[0], el);
        }
    });
};
