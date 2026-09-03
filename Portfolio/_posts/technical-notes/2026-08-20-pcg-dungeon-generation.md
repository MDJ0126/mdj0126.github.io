---
title: PCG 던전 생성 (예정)
category: technical-notes
category_label: TECHNICAL NOTES
permalink: /technical-notes/pcg-dungeon-generation/
summary: 절차적 생성 규칙으로 매번 다른 형태의 던전을 구성하는 과정을 정리한 예제입니다.
date: 2026-08-20
order: 1
tags: [PCG, Dungeon Generation, C#]
---
## 목표

방과 통로를 절차적으로 배치하고, 모든 구역이 연결된 플레이 가능한 던전을 생성합니다.

## 생성 과정

1. 시드 값을 기준으로 후보 방을 배치합니다.
2. 겹치는 방을 제거하고 유효한 방만 남깁니다.
3. 방 사이의 연결 관계를 그래프로 구성합니다.
4. 최소 신장 트리를 기준으로 필수 통로를 생성합니다.
5. 일부 연결을 추가해 순환 경로와 탐색 선택지를 만듭니다.

## 확인할 항목

- 동일한 시드에서 같은 결과가 재현되는지
- 시작 지점에서 모든 방에 도달할 수 있는지
- 막다른 길과 순환 경로의 비율이 적절한지
- 생성 실패 시 상태를 초기화하고 다시 시도하는지
