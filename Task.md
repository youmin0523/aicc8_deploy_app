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

---

## 1. 상세 개발 및 검증 현황 (V1 파트 집중)

### [Task 1] User Authentication (OAuth)

- [x] **Logic**: `@react-oauth/google` 라이브러리 연동 완료.
- [x] **State**: `authSlice`를 통한 유저 세션 전역 관리 완료.
- [x] **Sync**: 로그아웃 시 로컬 스토리지 클리어 및 Redux 초기화 완료.
- **[Verification Required]**: 토큰 만료 후 보호된 경로 접근 시 401 에러와 함께 로그인 유도 모달 노출 여부 다시 확인.

### [Task 2] Dashboard Layout & Sidebar

- [x] **Component**: `Navbar.jsx` (사이드바), `ItemPanel.jsx` (메인) 연동 완료.
- [x] **UX**: 사이드바 축소/확장 애니메이션 (`will-change` 가속) 적용 완료.
- [x] **Responsive**: 768px/1024px 변곡점 기반 그리드 전환 로직 완료.
- **[Verification Required]**: 사이드바 서치바에 초성 검색 기능 확장 시 정규식(Regex) 성능 점검.

### [Task 3] Item Service (CRUD)

- [x] **Create**: 모달 기반 `POST /post_task` 연동 완료.
- [x] **Update**: `PUT /update_task` 기반 필드 전체 수정 및 `PATCH` 기반 상태 토글 완료.
- [x] **Delete**: 삭제 컨펌 팝업 및 `DELETE` API 연동 완료.
- **[Verification Required]**: 아이템 100개 이상 등록된 유저 계정에서 필터 전환 시 0.2초 이내 반응 유무 벤치마킹.

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
