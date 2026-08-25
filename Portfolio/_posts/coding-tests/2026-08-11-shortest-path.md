---
title: 최단 경로 · 다익스트라
category: coding-tests
category_label: ALGORITHM
permalink: /coding-tests/shortest-path/
summary: 우선순위 큐를 사용해 가중치 그래프의 최단 거리를 구하는 풀이입니다.
date: 2026-08-11
order: 1
tags: [Graph, Dijkstra, C++]
---
## 문제 접근

가중치가 음수가 아니므로 다익스트라 알고리즘을 사용합니다.

## 핵심 코드

```cpp
while (!queue.empty()) {
    auto [cost, node] = queue.top();
    queue.pop();
    if (distance[node] < cost) continue;
}
```

## 복잡도

인접 리스트와 우선순위 큐를 사용하면 `O((V + E) log V)`입니다.
