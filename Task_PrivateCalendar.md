# Task: Private Calendar 시스템 구축 (다이어리 & 습관 관리)

## Revision History

**[Current Revision: v1.3_20260219]**

- **v1.1_20260219**: 화이트 스크린 버그 수정 및 임포트 경로 정규화.
  - **[Front]**: `privateCalendarSlice` 위치 이동 (`redux/` -> `redux/slices/`) 및 `HabitTab.jsx` 누락된 `addHabitThunk` 임포트 추가.
  - **[Fix]**: 모듈 로드 실패로 인한 화면 렌더링 오류 해결.
- **v1.2_20260219**: 컴포넌트 런타임 에러 수정 및 백엔드 로직 보완.
  - **[Front]**: `PrivateCalendarMain.jsx` 내 `useSelector`, `useNavigate` 임포트 누락 수정 (White Screen 근본 원인 해결).
  - **[Front]**: `axios` 라이브러리 의존성 추가 및 설치.
  - **[Back]**: `private_habit_logs` 테이블 유니크 제약 조건 추가 및 SQL 타입 캐스팅 정교화.
  - **[Back]**: API 에러 핸들링 강화 (상세 에러 메시지 반환).
- **v1.3_20260219**: 할일(Todo) 모듈 설계 및 구현.
  - **[UI]**: 모달 스크롤 대응, 날짜 선택 UX 개선, 사용자 정의 카테고리 기능 추가.
- **v1.5_20260219**: UI 디자인 고도화 및 일정 모듈 기능 강화.
  - **[UI]**: 메인 캘린더 및 탭 시스템에 고급 글래스모피즘(Glassmorphism), 그라데이션 보더, 라디알 글로우 효과 적용. (Premium Design)
  - **[Front]**: `ScheduleTab.jsx` 내 이미지 첨부파일 미리보기(Thumbnail) 기능 구현.
  - **[Front]**: `HabitTab.jsx` 스크롤 영역 최적화 및 레이아웃 깨짐 수정.
  - **[Fix]**: 신규 할 일 등록 모달의 클리핑(Clipping) 현상 해결을 위한 Height 및 Portals 대응 검토.
  - **[Back]**: 모든 할 일(V1+V2)의 정렬 기준을 생성일 내림차순(Created At DESC)으로 통일.

---

## 1. 작업 목표

- **개인화된 일정 관리**: 기존 업무 중심에서 나아가 개인의 기록(다이어리)과 성취(습관)를 관리하는 전용 공간 구축.
- **네이버 캘린더 벤치마킹**: 다이어리, 습관, 할일, 일정 4대 카테고리 구성.
- **UX 가독성**: 시각적으로 프리미엄하고 직관적인 탭 시스템 및 입력 폼 구현.

## 2. 세부 작업 내역 (체크리스트)

### Phase 1: Infrastructure & DB (Backend)

- [x] `back/database/database_private_calendar.sql` 작성 및 테이블 생성
- [x] `back/controllers/privateCalendarControllers.js` 구현 (Diary, Habit CRUD)
- [x] `back/routes/privateCalendarRoutes.js` 구현 및 `index_v2.js` 연동

### Phase 2: Frontend Foundation

- [x] `front/src/redux/slices/privateCalendarSlice.js` 생성 및 초기 상태 정의
- [x] `front/src/components/v2/PrivateCalendar/PrivateCalendarMain.jsx` 레이아웃 및 탭 시스템 구축

### Phase 3: Diary Module Implementation

- [x] `DiaryTab.jsx` 구현 (글쓰기, 날짜 선택, 이미지 프리뷰/업로드)
- [x] 다이어리 리스트 및 상세 조회 UI 구축

### Phase 4: Habit Module Implementation

- [x] `HabitTab.jsx` 구현 (습관 항목 선택 리스트 구축)
- [x] 습관 설정 모달 (시간, 반복주기, 목표 기간, 알림 설정) 구현
- [ ] 습관 체크 및 통계 UI 가이드라인 구축

### Phase 5: Todo Module Implementation

- [x] `TodoTab.jsx` 기본 레이아웃 및 데이터 구조 정의
- [x] 할일 입력 폼 구현 (할 일, 중요도, Due Date, 설명, 카테고리)
- [x] 할일 목록 렌더링 및 완료 여부 체크 기능
- [x] 리덕스 연동 및 백엔드 API 호출 로직 구축

### Phase 6: Schedule Module Implementation (New)

- [x] `private_schedules` 테이블 및 컨트롤러/라우트 구축
- [x] `ScheduleTab.jsx` 구현 (7대 필수 필드 포함)
- [x] 파일 첨부 및 기념일/반복 설정 UI 최적화
- [x] Redux 연동 완료

### Phase 7: UI/UX Polishing

- [x] 프리미엄 디자인 적용 (글래스모피즘, 마이크로 애니메이션)
- [x] 반응형 레이아웃 최적화
- [x] 첨부파일 미디어 쿼리 및 미리보기 최적화

## 3. 실행 및 검증 계획

- **API 테스트**: Postman/Thunder Client를 통한 CRUD 동작 확인.
- **UI 테스트**: 탭 전환 시 상태 유지 및 데이터 인터랙션 확인.
- **데이터 정합성**: 유저별 데이터 격리 및 로컬 시간대 반영 확인.
