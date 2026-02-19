# Task: Private Space 습관 탭 고도화

## 🎯 작업 목표

`Private Space` 내 습관 탭에서 사용자가 습관을 선택하고 상세 설정(시간, 주기, 기간, 알림)을 거쳐 등록할 수 있는 기능을 완성한다.

## 📋 체크리스트

- [x] **Task & Implementation Plan 수립**
- [x] **HabitTab UI 고도화**
  - [x] 습관 선택 시 설정 모달(Modal) 노출 로직 구현
  - [x] 시간 설정 필드 (시작 시간 ~ 종료 시간)
  - [x] 반복 주기 필드 (매일, 특정 요일 등)
  - [x] 목표 기간 설정 필드
  - [x] 알림 설정 온/오프 및 시간 설정
- [x] **Redux 및 API 연동**
  - [x] `addHabitThunk` 파라미터 확장 반영
  - [x] 백엔드 스키마와 정합성 확인
- [x] **디자인 Polish**
  - [x] 프리미엄 다크 모드 스타일 유지
  - [x] 부드러운 트랜지션 및 애니메이션 적용

## 📅 진행 상황

- **v1.0**: 초기 분석 완료. `HabitTab.jsx` 기존 로직 확인.
- **v1.1**: 상세 설정 모달 구현 계획 수립.
- **v1.2**: HabitTab 고도화 완료 및 문법 오류 수정. (Done)
- **v1.3**: 할일(Todo) 탭 UI 구현 완료 및 PrivateCalendarMain 연동. (In Progress)

## 🆕 추가 작업: Todo Tab 고도화

- [x] **TodoTab UI 기본 레이아웃**
- [x] **할일 입력 폼 구현**
  - [x] 할 일 제목 및 설명 입력
  - [x] 중요도(Priority) 선택 시스템
  - [x] 마감 기한(Due Date) 프리셋 및 커스텀 선택
  - [x] 카테고리 그룹 분류
- [ ] **데이터 영속성 확보 (Next Step)**
  - [ ] Todo CRUD API 연동
  - [ ] Redux Thunk 연동
