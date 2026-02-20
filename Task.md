# 📋 Task Checklist: V1 Foundation & Project Lifecycle

## 0. Revision History (Project-Wide)

**[Latest Revision: v2.7_260220]**

### Phase 1: V1 Core Infrastructure (260129)

- **Status**: [Completed] 100%
- **Work Content**: React 프로젝트 초기화, Vite 환경 구축, PostgreSQL 연동 인프라 완성.
- **Troubles**: DB 커넥션 이슈, 초기 환경 설정 충돌 해결.

### Phase 2: Responsive Master Layout (260130)

- **Status**: [Completed] 100%
- **Work Content**: 1024px 기준 사이드바 토글 및 메인 패널 유동적 레이아웃 구현.
- **Troubles**: 윈도우 리사이징 시 사이드바 잔상 이슈(Transition Blur) 해결.

### Phase 3: Authentication & Data Security (260205)

- **Status**: [Completed] 100%
- **Work Content**: Google OAuth 2.0 연동 및 `userId` 기반 데이터 격리 로직 구현.
- **Troubles**: JWT 디코딩 시 `sub` 값 누락으로 인한 데이터 혼선 이슈 핫픽스.

### Phase 4~6: CRUD & Advanced Interaction (260211)

- **Status**: [Completed] 100%
- **Work Content**: 비동기 상태 갱신(No-Refresh) 처리, Search & Filter 정합성 고도화.
- **Troubles**: 대량 데이터 로드 시 렌더링 병목 현상(Lags) 최적화.

### Phase 7: Private Calendar V2 Refactoring (Current)

- **Status**: [In Progress] 90%
- **Work Content**: 레이아웃 안정화, 통합 마킹 시스템, 시네마틱 FAB, 스마트 블릿 에디터 구현.
- **Current Milestone**: 마커 가시성 및 스마트 에디터 UX 보정 완료.

---

## 1. 상세 개발 및 검증 현황 (V1 & V2 통합)

### [Task 1] User Authentication (OAuth)

- [x] **Logic**: `@react- [x] V1/V2 통합 인증 세션 복구 (이중 로그인 제거)
- [x] 서버 JSON 페이로드 용량 확장 (50MB)
- [x] 이미지 포함 다이어리 저장 로직 정상화
- [ ] 다이어리 텍스트 영역 스크롤 및 레이아웃 완벽화 (Pending)시 로컬 스토리지 클리어 및 Redux 초기화 완료.
- **[Verification Required]**: 토큰 만료 후 보호된 경로 접근 시 401 에러와 함께 로그인 유도 모달 노출 여부 다시 확인.

### [Task 2] Dashboard Layout & Sidebar (Refined)

- [x] **Component**: `NavbarV2`, `PrivateCalendarMain` 레이아웃 고정(`h-screen`).
- [x] **UX**: 캘린더/다이어리 1.4:1 비율 최적화 및 6주차 대응 타일 높이(62px) 보정.
- [x] **Cinematic**: "Gift Unboxing" FAB (Burst & Collect) 애니메이션 적용.
- **[Verification Required]**: 저해상도 기기에서 FAB 버튼과 다이어리 입력창의 간섭 유무 재검수.

### [Task 3] Item Service & Marking Logic

- [x] **Marker**: 다이어리(Teal), 일정(Purple), 습관(Emerald) 통합 도트 마커 시스템 구현.
- [x] **API**: 백엔드 통합 마킹용 경량 API 2종 (`diaries/all`, `habits/logs/all`) 연동 완료.
- [x] **Smart Edit**: Todo 설명란 `- ` 자동 생성 및 엔터 연동 로직 이식 완료.
- **[Verification Required]**: 다이어리 대량 작성 유저의 캘린더 타일 렌더링 성능(FPS) 측정.

---

## 2. 작업 히스토리 요약

- **V1.0 (260129~)**: 기반 구축 및 안정성 확보 시기.
- **V2.0 (260205~)**: 사용자 편의성 및 보안 강화 시기.
- **V2.8 (Current)**: V2 고도화 및 세밀한 인터랙션(애니메이션, 에디터 UX) 완성 단계.

---

## 3. 정밀 검증 시나리오 명세

1. **Scenario 1 [Session Timeout]**: 로그인 후 1시간 대기 -> 토큰 만료 후 할 일 수정 시도 -> 실패 메시지 및 재로그인 유도 확인.
2. **Scenario 2 [Input Validation]**: 할 일 설명란 자동 블릿 생성 중 백스페이스 입력 시 블릿 파괴 방지 여부.
3. **Scenario 3 [Network Failover]**: 캘린더 마킹 데이터 로드 실패 시 대체 UI(No-Marker) 및 재시도 로직 작동 확인.

### [Task 4] Aesthetics & Performance

- [x] **CLS**: 버튼 고정 너비로 레이아웃 흔들림(Layout Shift) 방지 완료.
- [x] **Dark**: `App.css` 기반의 전역 다크 모드 스타일 정립 완료.
- [x] **Loader**: 데이터 패칭 중 스켈레톤(Skeleton) 레이어 노출 완료.
- **[Verification Required]**: 저사양 사양(모바일 기기)에서의 `backdrop-filter` 렌더링 시 전력 소모 및 발열 유무 정량 체크.

---

## 2. 작업 히스토리 요약

- **V1.0 (260129~)**: 기반 구축 및 안정성 확보 시기.
- **V2.0 (260205~)**: 사용자 편의성 및 보안 강화 시기.
- **V2.7 (Current)**: V2 고도화 작업의 기반 인프라로서의 V1 코드 유지보수 단계.

---

## 3. 정밀 검증 시나리오 명세

1. **Scenario 1 [Session Timeout]**: 로그인 후 1시간 대기 -> 토큰 만료 후 할 일 수정 시도 -> 실패 메시지 및 재로그인 유도 확인.
2. **Scenario 2 [Input Validation]**: 할 일 제목에 100자 이상 입력 시 입력 제한 및 경고 텍스트 표시 여부.
3. **Scenario 3 [Network Failover]**: API 서버 다운 상황에서 Toast 알림 및 유저 입력값 보존 여부.
