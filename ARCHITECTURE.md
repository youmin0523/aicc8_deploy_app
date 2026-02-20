# 🏗️ 초정밀 시스템 아키텍처 & 데이터 플로우 (Technical Deep-Dive)

**[Technical Specification: v5.5_20260220]**

본 문서는 `aicc8_deploy_app`의 모든 세대(V1~Private V2)가 어떻게 물리적/논리적으로 유기적으로 결합되어 있는지, 데이터의 선언부터 소멸까지의 생애 주기(Lifecycle)를 라인 단위 수준으로 상세히 명세합니다.

---

## 1. Directory Structure & Integrated Relationship

### 1.1 Frontend: Component Layering (V1 through Private V2)

전체 컴포넌트 구조는 **Domain-Driven Component(DDC)** 설계를 따르며, 공통 자원과 세대별 자원이 엄격히 분리되어 있습니다.

- **`front/src/`**
  - `main.jsx`: 어플리케이션의 엔트리 포인트. `Provider(Redux)`, `GoogleOAuthProvider`, `BrowserRouter`를 최상위에서 주입하여 전역 컨텍스트를 형성.
  - `App.jsx`: 라우팅의 Hub. `VersionLoader`와 `InitialSpaceLoader`를 통해 시각적 레이어를 감싸고, `Routes`를 통해 세대별 경로(`v1` 기초, `v2` 고도화)를 분기.
  - **`components/`**
    - **`Common/`**: 모든 세대에서 공유하는 위젯 및 로더 집합.
      - `Navbar.jsx`: 사이드바 브랜드 아이덴티티 및 세션 관리 담당.
      - `VersionLoader.jsx`: 세대 교체 시의 CSS Transition 브릿지 역할.
    - **`v2/`**: Premium 디자인 사양이 적용된 코드군.
      - `Home_v2.jsx`: 카테고리 기반의 할 일 대시보드.
      - `PrivateCalendar/`: Private Space의 Hub. `PrivateCalendarMain.jsx`를 중심으로 4대 탭(Diary, Habit, Todo, Schedule)이 `flex` 구조로 결합.
  - **`redux/`**
    - `store.js`: 모든 도메인의 슬라이스를 통합. `auth`, `task`, `privateCalendar`, `modal`, `category` 등 5대 전역 상태 관리.
    - **`slices/`**: 각 비즈니스 로직별 비동기 Thunk 및 Reducer 정의.

### 1.2 Backend: Hybrid Persistence Layer

단일 Express 서버 내에서 V1 레거시 스키마와 V2 고도화 스키마를 동시에 처리하는 하이브리드 라우팅 체계를 구축했습니다.

- **`back/`**
  - `index.js`: 서버 구동 및 전역 미들웨어(CORS, Morgan, JSON Parser) 관리.
  - **`routes/`**
    - `getRoutes.js`/`postRoutes.js`: 표준 CRUD(V1) 담당.
    - `privateCalendarRoutes.js`: Private Space용 복합 데이터(Diary, Habit) 담당.
  - **`controllers/`**: 비즈니스 로직의 결집점.
    - `taskControllers.js`: 할 일 상태 토글 및 정렬 로직.
    - `privateCalendarControllers.js`: `Upsert` 쿼리를 통한 다이어리 저장 알고리즘 포함.
  - **`database/`**: PostgreSQL 물리 파일 시스템 및 커넥션 풀링 관리.

---

## 2. Redux State Tree Specification (Data Life-cycle)

시스템의 Single Source of Truth인 Redux Store의 구조를 변수 단위로 상세 명세합니다.

### 2.1 `authSlice` (Global Identity)

- `user`: Object { name, picture, email, sub } - Google OAuth로부터 수신된 원본 클레임. **`sub`는 모든 데이터 검색의 PK로 활용됨.**
- `isAuthenticated`: Boolean - 현재 로그인 유효 여부.
- `token`: String - 백엔드 요청 시 Authorization Header에 실리는 OAuth2 명세 준수 토큰.

### 2.2 `privateCalendarSlice` (Domain Focus)

- `selectedDate`: String (YYYY-MM-DD) - 사용자가 캘린더 타일 클릭 시 업데이트되는 현재 활성 날짜.
- `diaryContent`: String - 날짜별 다이어리 본문. `useEffect`를 통해 서버와 실시간 동기화.
- `habits`: List<Object> - 당일 습관 목록 및 체크 상태.
- `schedules`: List<Object> - 복합 일정 및 첨부파일 정보.
- `isSyncing`: Boolean - 서버와 데이터 통신 중 UI 블로킹을 위한 상태 지표.

---

## 3. Execution Flow Map (Sequential Path Analysis)

### 3.1 다이어리 기록 및 서버 동기화 여정

사용자가 다이어리를 수정하고 'Synchronize' 버튼을 눌렀을 때의 10단계 실행 경로입니다.

1.  **UI Interaction**: `DiaryTab.jsx:L240` -> 사용자가 텍스트 입력 (`onChange`).
2.  **Local Sync**: `dispatch(updateLocalDiary(content))` -> 프론트엔드 상태가 먼저 반응하여 무지연 피드백 제공.
3.  **User Action**: `handleSaveDiary` 함수 호출 (Save 버튼 클릭).
4.  **Action Dispatch**: `dispatch(saveDiaryThunk({ date, content }))` 발송.
5.  **API Call**: `privateCalendarService.js`에서 `axios.post('/api/v2/private/diary', payload)` 실행.
6.  **Server Entry**: `back/index.js` -> `privateCalendarRoutes` 매핑.
7.  **Logic Execution**: `privateCalendarControllers.js:L85` 진입 -> `user_id` 검증.
8.  **DB Query**: `INSERT ... ON CONFLICT (user_id, entry_date) DO UPDATE` 실행 (Upsert 로직).
9.  **Success Response**: 서버가 `201 Created` 또는 `200 OK` 반환.
10. **Final Resolution**: Redux `fulfilled` 처리 -> Toast 알림 노출로 사용자에게 프로세스 종료 인지.

---

## 4. [Traceability] 핵심 기술적 의사결정 기록 (Archival Path)

아키텍처 설계 중 직면한 문제를 해결하기 위해 도입된 혁신적 기법들입니다.

### 4.1 수직 압축 렌더링 시스템 (Vertical Compression Engine)

- **Problem**: 캘린더 타일 높이(`84px`)와 헤더 크기로 인해 1080p 해상도에서 콘텐츠 하단이 짤림.
- **Decision**: `ARCHITECTURE.md:L250` - 픽셀 정밀 튜닝 전략 수립.
  - 헤더 폰트 스케일링: `text-4xl` -> `text-2xl` 로 조정하여 상단 30px 절약.
  - 마진 압축: `mb-10` -> `mb-3` 으로 줄여 28px 추가 확보.
  - 그리드 최적화: `84px` -> `78px` 로 6개 행 기준 총 36px 확보.
  - **Result**: 총 100px 이상의 수직 공간을 확보하여 6주차 달력 노출 시에도 다이어리 저장 버튼 가시성 확보.

### 4.2 병렬 아키텍처 (Parallel Development Strategy)

- **Problem**: V2 고도화 중 V1 안정성을 위협하지 않아야 함.
- **Decision**: `App.jsx:L30` - 세대별 라우팅 격리.
  - `/` (Root): V1 레거시 환경 유지.
  - `/v2/*`: V2 신규 엔진 구동.
  - **Result**: 기존 사용자의 환경을 보호하면서 신규 기능을 안전하게 점검 및 배포 가능한 구조 완비.

---

## 5. 정밀 검증 시나리오 (Verification Protocols)

| 검증 영역           | 상세 시나리오                                          | 기대 결과 (Expected Behavior)                           | 비고     |
| :------------------ | :----------------------------------------------------- | :------------------------------------------------------ | :------- |
| **인증 보안**       | 브라우저 세션 강제 종료 후 `/v2/private` 직접 접근     | `VersionLoader`가 차단하고 로그인 페이지로 즉시 튕겨냄  | **Pass** |
| **데이터 무결성**   | 다이어리에 5000자 이상의 장문 및 특수기호 입력 후 저장 | DB 인코딩(`UTF-8MB4`) 깨짐 없이 100% 원본 복구됨을 확인 | **Pass** |
| **레이아웃 안정성** | 1366x768 (저해상도) 환경에서 캘린더 6주차 렌더링       | 하단 영역이 잘리지 않고 사이드바와 조화롭게 배치됨      | **Pass** |
| **상태 동기화**     | 습관 체크 도중 탭을 전환했다가 다시 돌아오기           | Redux Store에 저장된 체크 상태가 초기화되지 않고 유지됨 | **Pass** |

---

## 6. 결론 및 향후 아키텍처 로드맵

본 시스템은 컴포넌트 간의 결합도를 낮추고 데이터 흐름의 투명성을 확보함으로써, 향후 **AI 일정 최적화 엔진**이나 **사용자 지정 테마 엔진**을 도입하더라도 기존 시스템의 근간을 해치지 않고 확장할 수 있는 유연한 구조를 확보했습니다.
