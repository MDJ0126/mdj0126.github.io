---
title: 연속 부분 수열 · 슬라이딩 윈도우
category: coding-tests
category_label: ALGORITHM
permalink: /coding-tests/sliding-window/
summary: 두 포인터로 조건을 만족하는 가장 짧은 연속 구간을 찾는 풀이입니다.
date: 2026-08-15
order: 2
tags: [Two Pointer, Array, C++]
---
## 아이디어

오른쪽 포인터로 합을 늘리고 조건을 만족하면 왼쪽 포인터를 이동합니다.

```cpp
for (int right = 0; right < n; ++right) {
    sum += values[right];
    while (sum >= target) sum -= values[left++];
}
```

각 포인터가 배열을 한 번씩 지나므로 시간 복잡도는 `O(N)`입니다.
