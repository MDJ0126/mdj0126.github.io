---
title: 비동기 에셋 로딩 연구
category: personal-projects
category_label: PERSONAL PROJECT
permalink: /personal-projects/asset-loading-lab/
summary: Addressables 로딩과 캐시 정책을 비교하고 화면 전환 흐름을 정리한 실험입니다.
date: 2026-08-18
order: 3
tags: [Unity, Addressables, Optimization]
---
## 실험 배경

콘텐츠 증가에 따라 초기 로딩 시간과 메모리 사용량을 함께 관리할 필요가 있었습니다.

## 확인 항목

- 동시 요청 병합
- 참조 카운트 기반 해제
- 실패한 다운로드의 재시도 정책

## 정리

로딩 상태를 하나의 서비스에서 관리하여 중복 요청과 해제 누락을 줄였습니다.
