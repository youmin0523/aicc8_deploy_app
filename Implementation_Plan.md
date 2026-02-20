# Implementation Plan: High-End Private Dashboard Architecture

## 1. 시스템 아키텍처 (System Architecture)

### 1.1 레이아웃 구조 (Flex-box Strategy)

- **Main Container**: `PrivateCalendarMain.jsx`에서 `h-screen`, `overflow-hidden`을 사용하여 뷰포트 고정.
- **Left Column (flex-7)**:
  - **Top (flex-1.4)**: `CalendarTab.jsx` 내 고정형 캘린더 매트릭스.
  - **Bottom (flex-1)**: `Daily Life Log` (Diary) 입력 영역.
- **Right Column (flex-3)**: Habit, Todo 등 사이드바 라이브 데이터 피드백.

### 1.2 데이터 플로우 (Marking System)

- **Flow**: `Component Mounting` -> `fetchAllDiaries/HabitLogsThunk` -> `Redux State Updated` -> `getTileContent` 리렌더링.
- **Marking Algorithm**: `tiles.some((item) => item.date === targetDate)` 기반의 실시간 렌더링.

## 2. 세부 구현 사양 (Technical Specs)

### 2.1 Smart Bullet Logic (TodoTab)

- **Input Interceptor**: `onKeyDown` 이벤트에서 `Enter` 감지 시 브라우저 기본 동작 차단.
- **Cursor Sync**: `selectionStart` + `\n- `를 조합한 새로운 문자열 생성 후 `setTimeout(0)`으로 커서 위치 재설정.

### 2.2 Cinematic FAB Dynamics

- **Motion Path**:
  - **Out**: `translate(24px, 48px) -> translate(0, 0)` (Burst Effect)
  - **In**: `translate(0, 0) -> translate(24px, 48px) / opacity-0` (Collect Effect)
- **Timing**: 부모 `opacity` 딜레이(200ms)를 통해 자식의 회수 애니메이션 가시성 완전 확보.

## 3. 검증 계획 (Validation Plan)

- [ ] 3월(6주차) 캘린더 렌더링 시 하단 다이어리 찌그러짐 여부 확인.
- [ ] 데이터 대용량화 시 캘린더 타일 렌더링 부하 테스트.
- [ ] 모바일/작은 해상도에서 FAB 버튼 레이어 순위(z-index) 체크.
