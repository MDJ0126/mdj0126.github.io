---
title: 블레이드 슬래시
category: personal-projects
category_label: PERSONAL PROJECT
permalink: /personal-projects/blade-slash/
summary: Unreal Engine 5 Blueprint로 콤보 전투, 스킬, 적 AI와 전투 UI를 구현한 탑다운 핵앤슬래시 프로젝트입니다.
genre: 탑다운 핵앤슬래시
date: 2026-09-02
order: 3
tags: [Unreal Engine, Blueprint, Hack and Slash, AI]
images: [bladeslash.gif]
tools:
  - { name: Unreal Engine, icon: unreal.png }
---
## 프로젝트 개요

- **개발 기간:** 2026.08.25 ~ 진행 중
- **개발 형태:** 기획 및 클라이언트 1인 개발
- **장르:** 탑다운 핵앤슬래시
- **기술:** Unreal Engine 5.5, Blueprint, Behavior Tree, Niagara, Enhanced Input
- **형상 관리:** Git, GitHub

플레이어의 입력부터 공격 판정, 적의 반응과 AI 행동, 이펙트 및 UI까지 연결되는 전투 흐름을 구현한 Unreal Engine 5 개인 프로젝트입니다. 기능 확장을 고려해 공통 캐릭터, 플레이어, 적을 상속 구조로 분리하고 캐릭터 및 스킬 정보를 데이터 테이블로 관리했습니다.

## 주요 구현

- 공격 애니메이션을 연계한 연속 공격 및 콤보 시스템 구현
- Animation Notify 기반의 전방 박스·구체 공격 판정 구성
- 일반 공격, 회전 베기, 순간 이동 궁극기 구현 및 스킬 범위 가이드 구현
- 적 유닛 Behavior Tree 기반의 감지·순찰·추적·공격 AI 구성
- 근접 미니언과 투사체를 발사하는 원거리 미니언 구현
- 체력 바, 콤보 카운트, 스킬 슬롯과 적 이름표 UI 제작
- 검 궤적, 피격 이펙트, 카메라 셰이크와 사망 래그돌 적용

## 개발 포인트

- `BP_Character`를 기준으로 플레이어와 적의 공통 체력·피격 처리를 분리하고, 실제 캐릭터가 필요한 전투 기능을 상속하도록 구조화
- 공격 몽타주의 Notify 구간에서 판정과 투사체 발사를 실행해 애니메이션과 실제 공격 시점을 동기화
- Blackboard와 Behavior Tree Service를 사용해 감지 여부, 공격 거리와 AI 상태에 따라 행동을 전환
- 스킬 및 캐릭터 정보를 데이터 테이블로 분리해 확장 가능한 전투 구조 구성

## 프로젝트 구조

```text
BP_Character
├─ BP_Player
│  └─ BP_Kwang (실제 플레이어블 캐릭터)
└─ BP_Enemy
   ├─ BP_Minion_Melee (근거리 몬스터)
   └─ BP_Minion_Siege (원거리 몬스터)
```

탑다운 시점에서 빠르게 전투를 전개하는 핵앤슬래시의 재미를 구현하는 데 중점을 두었습니다. 공격 애니메이션과 판정, AI의 반응 및 시각적 피드백을 하나의 흐름으로 연결해 조작과 공격 결과가 명확하게 전달되는 전투 경험을 구성했습니다.

[GitHub에서 프로젝트 보기](https://github.com/MDJ0126/BP_HackAndSlash)
