---
title: 실시간 로비 시스템
category: personal-projects
category_label: PERSONAL PROJECT
permalink: /personal-projects/realtime-lobby-sample/
summary: 방 생성과 참가, 준비 상태 동기화를 구현한 네트워크 로비 샘플입니다.
date: 2026-08-14
order: 2
tags: [Unity, Network, Lobby]
---
## 목표

클라이언트의 로비 상태와 서버 응답을 명확히 분리하는 구조를 실험했습니다.

## 주요 구현

- 방 목록 갱신 및 페이징
- 참가자 준비 상태 동기화
- 연결 종료와 재접속 예외 처리

## 결과

UI가 네트워크 구현 세부사항에 직접 의존하지 않도록 이벤트 계층을 두었습니다.
