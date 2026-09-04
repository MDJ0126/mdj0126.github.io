---
title: "라스트 헌터 K : 서울"
category: company-projects
category_label: COMPANY PROJECT
permalink: /company-projects/last-hunter-k/
summary: 클라이언트 전체 흐름과 비동기 로딩·리소스 관리 구조를 설계한 헌팅 액션 프로젝트입니다.
genre: 헌팅 액션
date: 2025-03-08
order: 3
tags: [Unity 6, C#, UniTask, Addressables, Jenkins]
icon: lasthunterk.jpg
images: [lastHunterK_1.jpg, lastHunterK_2.jpg, lastHunterK_3.jpg, lastHunterK_4.jpg, lastHunterK_5.png]
tools:
  - { name: Unity, icon: unity.png }
---
## 프로젝트 개요

- **개발 기간:** 2023.12 ~ 2026.07
- **출시:** 2026년 4월
- **장르:** 헌팅 액션
- **소속:** 해긴
- **팀 구성:** 총 20명 · 클라이언트 4명
- **기술:** Unity 6, C#, Addressables, uGUI, URP
- **관리 및 배포:** SVN, Jenkins

게임의 전반적인 프로세스 구축, 빌드 및 배포, QA 이슈 대응

## 담당 기능

- 앱 실행부터 로그인, 로비, 인게임 진입 및 복귀까지 클라이언트 전체 흐름 설계·구현
- 서버 통신, 데이터 로드 및 리소스 초기화 구조 설계
- UI 전환과 씬 로딩을 관리하는 씬 전환 시스템 개발
- 동시 씬 전환 요청을 순차 처리하는 큐 기반 구조 구현
- 공통 씬 매니저를 만들고 각 씬에서 필요한 초기화를 해당 씬이 담당하도록 구성
- UniTask와 async/await 기반 비동기 로딩 시스템 구축
- Excel 데이터 기반 C# 데이터 클래스 생성 구조 관리 및 개선
- ID 조회 중심의 데이터 테이블을 List에서 Dictionary 구조로 전환
- 콘텐츠별로 분산된 스탯 데이터를 공통 스테이터스 테이블 구조로 통합
- 캐릭터 커스터마이징 및 장비 파츠 시스템 개발
- 플랫폼 로그인과 TCP 기반 멀티플레이 매칭 기능 개발
- 게임 모드에 따른 캐릭터·적 생성 및 전투 진입 로직 개발
- Addressables 기반 리소스 로드·해제 관리 구조 구축
- AAB 및 Play Asset Delivery 기반 Android 리소스 배포 체계 구축
- Jenkins 기반 Android·iOS 빌드·배포 및 유지보수
- 글로벌 출시 및 라이브 서비스 업데이트·QA 이슈 대응

## 주요 성과

- 서버 요청과 데이터·리소스 로드를 병렬화하여 앱 실행부터 로비 진입까지의 초기 로딩 시간을 약 20초에서 약 5초로 단축
- ID 기반 조회가 반복되는 데이터 테이블을 List에서 Dictionary로 전환하고 생성 템플릿과 참조 코드를 일괄 수정
- 분산된 스탯 데이터를 공통 스테이터스 테이블과 ID 참조 방식으로 재설계해 중복 데이터 제거
- 리소스 관리 방식을 Addressables와 PAD 기반으로 전환하고 로드·해제 상태를 확인하는 내부 도구 제작
- 출시 후 약 2개월간 Logcat과 Unity 디버깅을 활용해 크래시 원인 분석과 개선을 주도하여 크래시율을 약 10%에서 약 2%로 감소
