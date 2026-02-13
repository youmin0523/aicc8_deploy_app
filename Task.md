# Task: V1 & V2 통합 로컬호스트 환경 구축

## Revision History

**[Current Revision: v3.64_260213]**

- **v3.64_260213**: [front/src/redux/slices/tasksSlice_v2.js]
  - **버그 수정(Critical)**: `patchItemThunk` 함수에서 API 요청 시 `JSON.stringify(data)` 변환이 누락되어 백엔드로 빈 객체가 전송되는 문제 해결.
  - **원인 규명**: 프론트엔드 요청 데이터 포맷 오류로 확인됨 (백엔드 로직 문제가 아님). (Done)

- **v3.63_260213**: [back/controllers/taskControllers_v2.js]
  - **긴급 조치(Hotfix)**: Task 상태 변경(`updateCompletedTaskV2`) 시 발생하는 DB 락(행 걸림) 가능성을 배제하기 위해 Audit Logging(`logTaskChange`) 호출을 임시 비활성화.
  - **진단**: 히스토리 테이블 생성 스크립트 실행이 지연되는 현상과 연관된 커넥션 풀 문제 해결 목적. (Debugging)

- **v3.62_260213**: [back/controllers/taskControllers_v2.js]
  - **안정성 강화**: Task 상태 변경 시 `task_logs` 테이블 부재로 인한 트랜잭션 롤백 방지 로직 추가.
  - **에러 핸들링**: Audit 로깅 실패 시 메인 로직은 정상 수행되도록 예외 처리(`try-catch`) 개선. (Done)

- **v3.61_260213**: [front/src/components/v2/CalendarSectionV2.jsx] & [back/create_table_task_logs.js]
  - **버그 수정**: `react-calendar` v6 호환성을 위해 `calendarType="US"`를 `calendarType="gregory"`로 변경하여 렌더링 오류(화면 꺼짐) 해결.
  - **DB**: `task_logs` 테이블 생성 스크립트 실행으로 백엔드 에러 방지. (Done)

- **v3.60_260213**: [front/src/components/v2/CalendarSectionV2.jsx]
  - **설정 변경**: 캘린더 시작 요일을 글로벌 표준인 '일요일(Sunday)'로 변경 (`calendarType="US"`). (Done)

- **v3.59_260213**: [front/src/components/v2/Modal_v2.jsx]
  - **UI 완성**: 모달 내 탭 시스템(Info/History) 도입 및 타임라인 기반 감사 로그(Audit Log) 뷰 구현. (Done)

- **v3.58_260213**: [front/src/redux/slices/tasksSlice_v2.js] & [utils/apiUrls_v2.js]
  - **데이터 연동**: 이력 조회용 ReduxThunk 및 API 엔드포인트 상수 추가. (Done)

- **v3.57_260213**: [back/controllers/taskControllers_v2.js] & [back/routes/taskRoutes_v2.js]
  - **시스템 구축**: Task 변경 감지 로깅 함수(`logTaskChange`) 및 이력 조회 API 구현.
  - **로직 추가**: 수정/상태 변경 시 이전 값과 비교하여 구체적인 변경 로그 생성. (Done)

- **v3.56_260213**: [back/database/database_v2.sql]
  - **스키마 확장**: 변경 이력 저장을 위한 `task_logs` 테이블 추가. (Done)

- **v3.55_260213**: [front/src/components/v2/ItemPanel_v2.jsx] & [CalendarSectionV2.jsx]
  - **레이아웃 수정**: 고정된 Neon Orb와 'Add New Task' 버튼 및 캘린더 날짜 배지가 겹치는 현상 해결 (`pr-40` 추가).
  - **시각적 정렬**: 대시보드 상단 요소들 간의 충돌 방지 및 여백 최적화. (Done)

- **v3.54_260213**: [front/src/components/v2/Navbar_v2.jsx]
  - **버그 수정**: 누락된 사이드바 개폐 상태(`isSidebarOpen`) 변수 복구 및 문법 오류 최종 수정. (Done)

- **v3.53_260213**: [front/src/components/v2/Navbar_v2.jsx]
  - **UX 이식**: V1의 핵심 기능인 Neon Orb(Today/Tomorrow 요약) 시스템을 V2에 이식.
  - **기능 추가**: 업무 요약 팝업, 호버 브릿지, 실시간 완료 처리(`handleGlobalComplete`) 기능 구현. (Done)

- **v3.52_260213**: [front/src/components/v2/Navbar_v2.jsx]
  - **UX 완성**: 'All Tasks' 클릭 시 상단으로 부드럽게 복귀하는 `handleAllTasksClick` 로직 추가.
  - **Navigation**: 캘린더와 할 일 목록 사이를 자유롭게 왕복하는 양방향 스무스 스크롤 인터랙션 고도화. (Done)

- **v3.50_260213**: [front/src/components/v2/ItemPanel_v2.jsx]
  - **기능 추가**: URL 해시(#calendar-view) 감지 및 온마운트 자동 스크롤 기능 구현. (Done)

- **v3.49_260213**: [front/src/components/v2/Navbar_v2.jsx]
  - **UX 개선**: Calendar 클릭 시 페이지 이동 없이 부동의 캘린더 섹션으로 스무스 스크롤 애니메이션 적용. (Done)

- **v3.48_260213**: [front/src/components/v2/ItemPanel_v2.jsx]
  - **아키텍처 변경**: 독립된 페이지였던 캘린더를 메인 패널 하단에 내장(Integrated)하고 전체 스크롤 활성화. (Done)

- **v3.47_260213**: [front/src/components/v2/CalendarSectionV2.jsx]
  - **모듈화**: V2 대시보드 내장을 위해 캘린더 핵심 로직을 독립 컴포넌트로 분리 및 최적화. (Done)

- **v3.42_260213**: [front/src/components/Common/Modal.jsx]
  - **수정**: 첫 글자 입력 시 하이픈 누락 현상 해결 및 자동 삭제 로직 추가. (Done)

- **v3.39_260213**: [front/src/components/Common/Modal.jsx]
  - **수정**: 가이드 텍스트 겹침 현상 해결 및 하이픈 생성 시점 교정. (Done)

- **v3.37_260213**: [front/src/components/Common/Modal.jsx]
  - **기능 추가**: Add Todo 시 영문 Placeholder 및 지능형 불렛 포인트(줄바꿈 자동 생성) 시스템 도입. (Done)

- **v3.36_260213**: [front/src/components/Common/Navbar.jsx]
  - **버그 수정**: 데스크탑/태블릿에서 상단 바 레이어가 사이드바 토글 버튼(<< >>)을 가려 클릭이 되지 않던 레이어 간섭 문제 해결. (Done)

- **v3.35_260213**: [front/src/components/Common/Navbar.jsx]
  - **UI 정제**: md(768px) 이상에서 상단 바의 로고를 숨기고 사이드바 아이덴티티로 일원화 (브랜드 중복 제거). (Done)

- **v3.34_260213**: [front/src/components/Common/ItemPanel.jsx]
  - **기능 고도화**: 카드 클릭 시 리스트 실시간 필터링(Total/Pending/Done/Vital) 및 지표별 툴팁 사전 추가. (Done)

- **v3.33_260213**: [front/src/components/Common/Navbar.jsx]
  - **기능 추가**: Neon Orb 재클릭 시 팝업 닫힘(Toggle-off) 로직 구현. (Done)

- **v3.32_260213**: [front/src/components/Common/Navbar.jsx]
  - **UX 보정**: Neon Orb 팝업의 위치를 아이콘 하단으로 앵커링하고, 호버 안정성을 위한 '브릿지 레이어' 도입. (Done)

- **v3.31_260213**: [front/src/components/Common/Navbar.jsx]
  - **레이아우스 보정**: 사이드바 탭 간격 및 행간 슬림화로 가독성 및 정보 밀도 최적화. (Done)

- **v2.98_260213**: [front/src/components/v2/Modal_v2.jsx]

- **v2.97_260213**: [back/controllers/taskControllers_v2.js]

- **v2.96_260213**: [front/src/components/v2/CalendarView_v2.jsx] & [Item_v2.jsx]
  - **수정**: DB 필드명 대소문자 매칭 이슈 해결 (Category Name/Color). (Done)

- **v2.95_260213**: [front/src/components/v2/CalendarView_v2.jsx]

- **v2.92_260213**: [front/src/components/v2/Modal_v2.jsx]

- **v2.91_260213**: [front/src/components/v2/Modal_v2.jsx] & [CalendarView_v2.*]

- **v2.90_260213**: [front/src/components/v2/CalendarView_v2.jsx] & [.css]

- **v2.89_260213**: [front/src/components/v2/CalendarView_v2.jsx]

- **v2.87_260213**: [front/src/components/v2/Modal_v2.jsx]

- **v2.86_260213**: [front/src/components/v2/Modal_v2.jsx]

- **v2.18_260212**: V1/V2 동시 지원을 위한 환경 최적화
  - [front/index.html]: 중복된 `main_v2.jsx` 로드 제거, `main.jsx` 단일 진입점 설정.
  - [front/src/App.jsx]: `App_v2.css` 임포트 추가로 V2 컴포넌트 스타일 보장.
  - [back/package.json]: `dev:v1`, `dev:v2` 스크립트 추가로 백엔드 서버 구분 실행 지원.

- **v2.19_260212**: V1 UI 레이아웃 및 테마 복구 (Critical)
  - [front/src/App.jsx]: 누락된 `App.css` 임포트 복구하여 `height: 100vh` 및 레이아웃 정합성 해결.
  - [front/src/App.css]: `body` 배경색(#121212) 지정으로 하단 화이트 영역 노출 버그 수정.
  - [front/src/App_v2.css]: `.page_section` 선택자 스코핑으로 V1/V2 스타일 간섭 방지.
  - [front/src/components/Common/Navbar.jsx]: 로그인/로그아웃 버튼을 다크 테마에 맞는 프리미엄 디자인으로 고도화.

- **v2.20_260212**: V2 기능 고도화 및 버그 수정
  - [front/src/components/v2/Modal_v2.jsx]: 할 일 생성 시 `categoryId` 빈 값을 `null`로 처리하여 DB 제약 조건 충돌 해결.
  - [front/src/components/v2/Navbar_v2.jsx]: 로그인 시 기본 카테고리(Personal, Study, Health 등) 자동 생성 로직 추가.
  - [front/src/components/v2/Item_v2.jsx]: 할 일 카드 내 완료 처리 및 중요 표시 토글 기능 활성화.

- **v2.21_260212**: V2 통신 메커니즘 전면 보강 및 카테고리 버그 수정
  - [front/src/utils/requests.js]: 서버 에러 발생 시 상세 메시지를 throw 하도록 fetch 로직 전면 수정.
  - [front/src/components/v2/Navbar_v2.jsx]: `useRef`를 도입하여 카테고리 중복 생성 방지 및 로그인 시 초기화 프로세스 안정화.
  - [back/controllers/taskControllers_v2.js]: INSERT 쿼리에 소문자 컬럼명을 명시하여 DB 호환성 확보 및 백엔드 로깅 추가.
  - [back/controllers/categoryControllers_v2.js]: SELECT/INSERT 쿼리 컬럼명 보정 및 에러 응답 형식 통일.

- **v2.22_260212**: V2 안정성 강화 (Critical Fix)
  - [back/controllers/taskControllers_v2.js]: `due_date` 포맷 보정 (T -> 공백) 및 모든 SQL 쿼리 컬럼명 소문자 통일.
  - [back/controllers/taskControllers_v2.js]: 백엔드 에러 응답 메시지 한글화 및 로깅 강화.
  - [front/src/utils/requests.js]: 서버 에러 응답 객체 전체를 프론트엔드로 전달하도록 수정.

- **v2.23_260212**: V2 디버깅 시스템 고도화 및 DB 정합성 최종 보정
  - [front/src/utils/requests.js]: 비 JSON 응답(HTML 에러 등)에 대한 예외 처리 및 텍스트 파싱 로직 추가.
  - [front/src/redux/slices/*.js]: 모든 V2 비동기 Thunk에 `rejectWithValue` 적용하여 상세 에러 전파 보장.
  - [front/src/components/v2/Modal_v2.jsx]: 에러 객체 전체를 분석하여 출력하도록 UI 로직 강화.
  - [back/controllers/taskControllers_v2.js]: `SELECT` 쿼리 내 컬럼명 소문자(`userid`, `categoryid`) 최종 통일.
  - [back/controllers/taskControllers_v2.js]: 서버 로그에 6Body` 데이터를 출력하도록 디버깅 로직 추가.

- **v2.57_260212**: 하이픈(-) 기반 자동 줄바꿈 및 모달 입력 편의 기능 이식
  - [front/src/components/v2/Item_v2.jsx]: 설명 필드 하이픈 감지 시 자동 줄바꿈 로직 적용.
  - [front/src/components/v2/Modal_v2.jsx]: 엔터 키 시 자동 글머리 기호 추가 및 생성 초기값 설정.

- **v2.85_260212**: V2 홈 화면 블랙아웃 이슈 해결 및 인증 시스템 통합
  - [front/src/components/v2/ItemPanel_v2.jsx]:
    - 누락된 리액트 훅(useEffect) 및 Redux 훅(useDispatch, useSelector) 임포트 복구.
    - 별도로 운영되던 `authV2` 슬라이스를 지양하고 `auth` 슬라이스로 일원화하여 버전 간 로그인 상태 무중단 동기화 구현. (Done)

- **v2.84_260212**: (Fixed via v2.85) ItemPanelV2 ReferenceError 수정
  - [front/src/components/Common/VersionLoader.jsx]:
    - 애니메이션 트리거 조건과 세션 스토리지 업데이트 시점을 분리하여 StrictMode의 이중 호출 시에도 타이머가 정상 동작하도록 보정.
    - 애니메이션이 완전히 종료된 후 버전을 동기화함으로써 "검은 화면" 상태에서 멈추는 현상을 근본적으로 해결. (Done)

- **v2.82_260212**: 로더 시스템 아키텍처 전면 개편 및 검은 화면 이슈 근본 해결
  - [front/src/index.css]: 모든 로더/전환 애니메이션 키프레임을 전역 CSS로 통합하여 로딩 보장 및 환경 호환성 100% 확보.
  - [front/src/components/Common/VersionLoader.jsx] & [InitialSpaceLoader.jsx]:
    - `bg-black` 오버레이를 `backdrop-blur-3xl` 및 반투명 스타일(opacity 95%)로 교체하여 "완전 블랙 화면" 고착 가능성을 물리적으로 차단.
    - 애니메이션 요소에 `z-50` 및 `opacity-100` 강제 트리거를 적용하여 가시성 확보.
    - 브라우저 콘솔 로그(`[VersionLoader]`, `[InitialSpaceLoader]`)를 추가하여 동작 상태 실시간 모니터링 체계 구축. (Done)

- **v2.81_260212**: (Superseded by v2.82) 버전 전환 로직 단순화
  - [front/src/components/Common/animations.css]: 로더 및 버전 전환에 필요한 모든 핵심 애니메이션을 외부 CSS로 분리하여 전역 가용성 확보.
  - [front/src/components/Common/InitialSpaceLoader.jsx] & [front/src/components/Common/VersionLoader.jsx]:
    - `styled-jsx` 미설치 환경에서도 애니메이션이 작동하도록 인라인 스타일을 외부 CSS로 전면 교체.
    - 애니메이션 미작동 시에도 시스템이 멈춘 것처럼 보이지 않도록 `[ SYSTEM MIGRATING... ]` 폴백 텍스트 및 펄스 효과 추가. (Done)

- **v2.79_260212**: 버전 전환 애니메이션 가시성 극대화 및 트리거 안정화
  - [front/src/components/Common/VersionLoader.jsx]:
    - 배경색을 깊이감 있는 네이비 블랙(#0a0c10)으로 변경하고, 비활성 버전 텍스트를 인지 가능하도록 더 밝게 보정.
    - 경로 감지 로직에 초기화 단계(sessionStorage 웜업)를 추가하여 브라우저 재시작 시에도 안정적으로 작동하도록 개선.
    - 연출 시간을 2.5초로 확장하여 사용자가 전환 효과를 충분히 인지할 수 있도록 최적화. (Done)

- **v2.78_260212**: (Superseded by v2.79) 버전 전환 애니메이션 트리거 및 렌더링 복구
  - [front/src/components/Common/VersionLoader.jsx]:
    - 기존의 '조건부 렌더링(Unmount)' 방식을 '상시 유지 + 오버레이(Overlay)' 방식으로 전면 개편.
    - 버전 전환 시 하위 컴포넌트(InitialSpaceLoader 등)가 언마운트되어 상태가 초기화되던 문제 해결.
    - z-index를 `20000`으로 상향하여 어떠한 연출 상황에서도 전환 애니메이션이 최상단에 노출되도록 보장. (Done)

- **v2.76_260212**: 자유로운 버전 마이그레이션 및 V2 인라인 로그인 강화
  - [front/src/components/Common/Navbar.jsx]:
    - 미인증 유저의 V2 진입 차단 로직(handleUpgradeClick)을 제거하여, 로그인 전이라도 시네마틱한 V2 전환 시각 효과 및 애니메이션을 직접 경험할 수 있도록 복구.
    - V2 대시보드 진입 후 중앙의 '로그인이 필요한 서비스입니다' 버튼을 통해 인증을 유도하도록 동선 최적화. (Done)

- **v2.75_260212**: (Rollback) V2 업그레이드 링크 로그인 선행 연동 테스트

- **v2.74_260212**: 로그인 안내 UX 디자인 복원 및 호버 효과 최적화
  - [front/src/components/Common/ItemPanel.jsx]: V1의 기존 `bg-gray-300` 컬러 디자인을 복구하고, 마우스 호버 시 자연스럽게 커지는 `scale-105` 효과 적용.
  - [front/src/components/v2/ItemPanel_v2.jsx]: V2의 기존 '점선 테두리(Dashed Border)' 박스 형태를 복원하고, 동일한 확대 인터랙션 및 클릭 로그인 기능 유지. (Done)

- **v2.73_260212**: 인라인(In-line) 로그인 트리거 기능 도입
  - [front/src/components/Common/ItemPanel.jsx]: '로그인이 필요한 서비스입니다.' 버튼 클릭 시 즉시 구글 로그인이 실행되도록 `useGoogleLogin` Hook 연결.
  - [front/src/components/v2/ItemPanel_v2.jsx]: V2 패널에도 동일한 인라인 로그인 핸들러를 적용하고, 한국어 문구로 통일하여 사용자 접근성 개선. (Done)

- **v2.72_260212**: 미인증 유저 인트로 상시 노출(Persistence) 로직 적용
  - [front/src/components/Common/InitialSpaceLoader.jsx]:
    - 로그인이 완료되지 않은 상태라면 새로고침 시마다 인트로가 다시 실행되도록 수정.
    - 로그인 성공 데이터가 있을 때만 `sessionStorage` 기록을 남겨 중복 인트로를 방지함으로써 서비스의 신비감 유지. (Done)

- **v2.71_260212**: 인트로 고착 현상 해결 및 오버레이 시스템 도입
  - [front/src/components/Common/InitialSpaceLoader.jsx]:
    - 인트로 중에도 백그라운드에서 앱 UI가 로드되도록 `children` 상시 렌더링(Overlay) 구조로 변경.
    - 2.5초 자동 인트로 단축 및 부드러운 페이드 아웃 효과, `Skip Intro` 버튼 추가로 사용자 제어권 강화. (Done)

- **v2.70_260212**: 초기 인트로 자동 전환 및 로그인 감지 로직 최적화
  - [front/src/components/Common/InitialSpaceLoader.jsx]:
    - 초기 우주 인트로(3.5초) 후 새로고침 없이도 자동으로 메인 UI가 나타나도록 `browsing` 상태 도입.
    - 메인 UI 노출 상태에서도 실시간 로그인을 감지하여 '지구 돌진(Zoom-in)' 시퀀스가 정상 작동하도록 예외 처리. (Done)

- **v2.69_260212**: 시네마틱 스페이스 인트로(Space Intro) 및 로그인 연출 도입
  - [front/src/components/Common/InitialSpaceLoader.jsx]:
    - 브라우저 초기 진입 시 우주에서 지구를 바라보는 고요한 연출 구현.
    - 로그인 성공 감지 시 지구로 초고속 돌진(Zoom-in) 및 화이트 플래시 효과를 통해 시스템 진입 연출 극대화. (Done)

- **v2.68_260212**: 올-커버리지(All-Coverage) 버전 전환 애니메이션 업그레이드
  - [front/src/components/Common/VersionLoader.jsx]:
    - 라벨 텍스트를 'DASHBOARD INTERFACE MIGRATION'으로 세련되게 변경.
    - 로켓/비행기 이동 궤적을 화면 하단에서 '중앙 관통형 무빙'으로 전면 수정 및 거리감(Scaling) 연출 추가. (Done)

- **v2.67_260212**: 시네마틱 버전 전환 애니메이션 고도화
  - [front/src/components/Common/VersionLoader.jsx]:
    - 로켓/비행기가 화면 중앙에 고정되지 않고 브라우저 전체(Left -> Right / Bottom -> Top)를 가로지르도록 궤적 애니메이션 수정.
    - 베지어 곡선과 `vw`/`vh` 단위 적용으로 더욱 역진적이고 프리미엄한 연출 구현. (Done)

- **v2.66_260212**: 버전 전환 애니메이션 로더(VersionLoader) 도입
  - [front/src/components/Common/VersionLoader.jsx]: V1/V2 전환 시 비행기/로켓 애니메이션이 포함된 전용 로더 개발.
  - [front/src/App.jsx]: `VersionLoader`를 라우팅 최상위에 적용하여 버전 체인지 감지 및 로딩 연출 구현. (Done)

- **v2.65_260212**: 시간 정보 고대비(High-Contrast) 최적화
  - [front/src/components/v2/Item_v2.jsx]:
    - 뱃지 배경 농도와 보더 불투명도를 높이고, 텍스트 색상을 고채도(`Emerald-50`, `Blue-50`)로 변경하여 가독성 극대화.
    - 어두운 배경에서도 날짜와 시간이 즉각적으로 각인되도록 시각적 대비 보정. (Done)

- **v2.64_260212**: 시간 정보 가독성 중심 고도화
  - [front/src/components/v2/Item_v2.jsx]:
    - 초소형 폰트와 이탤틱체를 제거하고, 11px~12px 기반의 '모던 인포 칩' 디자인으로 전면 개편.
    - Entered(Emerald)와 Deadline(Blue) 배지를 시각적으로 명확히 분리하여 정보 인지 속도 개선. (Done)

- **v2.63_260212**: 하단 상태 버튼 여백 초정밀 축소
  - [front/src/components/v2/Item_v2.jsx]: 버튼 상단 마진(`mt-2`) 및 패딩(`pt-2`)을 추가로 줄여 콤팩트 레이아웃 완성. (Done)

- **v2.62_260212**: 할 일 카드 콤팩트 레이아웃 최적화
  - [front/src/components/v2/Item_v2.jsx]:
    - 카드 전체 높이를 `h-[380px]`로 축소하고 내부 패딩(`p-5`) 및 마진(`mb-4`, `mt-4`)을 조정.
    - 한 화면에 더 많은 항목이 보이도록 가시성을 확보하면서도 정렬 상태 유지. (Done)

- **v2.61_260212**: 할 일 카드 전체 높이 고정 및 완벽한 그리드 정렬
  - [front/src/components/v2/Item_v2.jsx]:
    - 메인 카드 높이를 `h-[480px]`로 고정하고 설명 영역을 `h-[72px]`로 단일화.
    - 설명의 줄 수와 관계없이 모든 하단 요소(시간, 버튼)가 수평선상에서 완벽하게 일치하도록 보정. (Done)

- **v2.60_260212**: 하단 레이아웃 높이 및 그리드 정렬 통일
  - [front/src/components/v2/Item_v2.jsx]:
    - 'DATE ENTERED', 'TARGET DEADLINE', '상태 버튼'의 높이를 `h-[52px]`로 단일화하여 시각적 균형미 완성.
    - 하단 상태 버튼을 박스 형태로 디자인하여 상단 블록들과의 통일감 부여. (Done)

- **v2.58_260212**: 할 일 카드 시간 표시 레이아웃 개편
  - [front/src/components/v2/Item_v2.jsx]: 등록 시간(Enter) 좌측, 마감 시간(Due) 우측 배치.

- **v2.59_260212**: 프리미엄 타임 블록 및 맥동 카테고리 태그 고도화
  - [front/src/components/v2/Item_v2.jsx]:
    - 'DATE ENTERED'와 'TARGET DEADLINE'의 위계를 분리한 하이엔드 대시보드 레이아웃 구축.
    - 블루 그라데이션, 글로우 효과, 그리고 카테고리 맥동(Pulse) 애니메이션 적용으로 트렌디한 감각 강화. (Done)

- **v2.24_260212**: 캘린더 UI/UX 고도화
  - [front/src/components/v2/CalendarView_v2.jsx]: 캘린더 타일 내부에 할 일 제목(Task Title)을 직접 표시하도록 변경.
  - [front/src/components/v2/CalendarView_v2.css]: 날짜를 좌측 상단으로 이동시키고 타일 높이를 확장하여 전문적인 캘린더 레이아웃 구현.

- **v2.25_260212**: 캘린더 한국화 및 가독성 완성
  - [front/src/components/v2/CalendarView_v2.jsx]: 주요 한국 공휴일(신정, 삼일절, 어린이날 등) 자동 표시 로직 추가.
  - [front/src/components/v2/CalendarView_v2.css]: 토요일(파랑), 일요일/공휴일(빨강) 색상 지정으로 한국 달력 컨벤션 적용.

- **v2.27_260212**: 2026년 특수 공휴일 데이터 완벽 보강
  - [front/src/components/v2/CalendarView_v2.jsx]: 설날 연휴, 부처님오신날, 지방선거, 추석 연휴(대체공휴일 포함) 등 2026년 기준 공휴일 데이터 정밀 매핑.

- **v2.28_260212**: 공휴일 가독성 및 UI 디테일 강화
  - [front/src/components/v2/CalendarView_v2.jsx]: 공휴일 명칭 폰트 크기 확대(9px -> 11px) 및 숫자 옆으로 위치 재배치.
  - [front/src/components/v2/CalendarView_v2.css]: 텍스트 그림자(Text Shadow) 강화로 어두운 배경에서의 시인성 극대화.

- **v2.29_260212**: 공휴일 레이아웃 최종 최적화
  - [front/src/components/v2/CalendarView_v2.jsx]: 공휴일 명칭을 날짜 칸의 우측 상단으로 이동하고 우측 정렬 적용.
  - [front/src/components/v2/CalendarView_v2.jsx]: 절대 좌표(absolute) 배치를 통해 날짜 숫자와의 시각적 충돌 완벽 차단.

- **v2.30_260212**: 공휴일 시각적 완성도 강화
  - [front/src/components/v2/CalendarView_v2.jsx]: 공휴일에 해당하는 날짜 숫자(Day Number)도 일요일과 동일하게 빨간색으로 표기되도록 로직 수정.
  - [front/src/components/v2/CalendarView_v2.css]: `.holiday` 클래스 스타일 추가로 한국형 달력의 시각적 완성도 확보.

- **v2.31_260212**: V1-V2 데이터 에코시스템 통합 (Data Sync)
  - [back/controllers/taskControllers_v2.js]: `UNION ALL`을 사용하여 V1 `tasks` 테이블과 V2 `tasks_v2` 테이블 데이터를 통합 조회하도록 개선.
  - [back/controllers/taskControllers_v2.js]: 수정/삭제/상태 변경 시 V1과 V2 테이블을 추적하여 실시간 연동 처리 로직 구현.
  - [front/src/components/v2/Item_v2.jsx]: V1에서 온 할 일은 '#888888' 컬러와 'V1 Task' 라벨로 구분 표시.

- **v2.32_260212**: 캘린더 지능형 호버 팝업 시스템 구축
  - [front/src/components/v2/CalendarView_v2.jsx]: 날짜 호버 시 전체 일정을 보여주는 프리미엄 팝업 렌더링 로직 추가.
  - [front/src/components/v2/CalendarView_v2.css]: 요일별 선택적 위치 제어(일~목: 우측, 금~토: 좌측) 및 글래스모피즘 스타일 적용.

- **v2.41_260212**: 2x2 그리드 영역 전용 오버레이 팝업 시스템 구축.
  - [front/src/components/v2/CalendarView_v2.css]: 팝업 규격을 2열 2행(`calc(200% + 2px)` x `241px`)으로 고정.
  - [front/src/components/v2/CalendarView_v2.jsx]: 팝업 상단을 날짜 상단 테두리에 정밀 정렬.

- **v2.46_260212**: 중요(Important) 할 일 항목 시각적 강조 시스템 구축
  - [front/src/components/v2/CalendarView_v2.jsx]: 팝업 내 중요 항목에 금색 별 아이콘 및 'IMPORTANT' 그라데이션 배지 추가.
  - [front/src/components/v2/CalendarView_v2.css]: 중요 항목 전용 골드 글로우 효과 및 애니메이션(`star-pulse`) 적용.

- **v2.47_260212**: 팝업 UI 디자인 정밀 고도화 및 정렬 최적화
  - [front/src/components/v2/CalendarView_v2.jsx]: 할 일 아이템의 `align-items: center` 적용으로 텍스트 수직 쳐짐 현상 해결.
  - [front/src/components/v2/CalendarView_v2.css]: 팝업 헤더/바디 간격 조정 및 아이템 높이 규격화(`min-height: 54px`)로 시인성 증대.

- **v2.48_260212**: 완료(Completed) 항목 시각적 구분 및 보존 시스템 구현
  - [front/src/components/v2/CalendarView_v2.jsx]: 팝업 및 타일 리스트에 완료 항목 출력 유지, 체크 아이콘(`MdCheckCircle`) 및 취소선 추가.
  - [front/src/components/v2/CalendarView_v2.css]: 완료 항목 전용 Dimmed 스타일 및 낮은 채도 설정으로 '달성 완료' 피드백 강화.

- **v2.50_260212**: V1 브랜드 아이덴티티(Logo, Font, Symbol) 복원 및 통합
  - [front/src/App_v2.css]: 'IBM Plex Mono' 폰트 및 V1 시그니처 로고(Gradient Circle/Square) 스타일 복원.
  - [front/src/components/v2/Navbar_v2.jsx]: 사이드바 상단에 v1 공식 로고 심볼 배치.
  - [front/src/components/v2/CalendarView_v2.css]: 중요 항목 컬러를 v2 고유색에서 v1의 Red 체계로 롤백 및 시각 효과 강화.

- **v2.52_260212**: 팝업 내 완료 항목 시각적 중복 제거 및 레이아웃 정돈
  - [front/src/components/v2/CalendarView_v2.jsx]: 팝업 내 겹쳐 보이던 우측 상단 absolute 배지와 체크 아이콘을 제거하고, 우측 Pill 형태 배지로 통합.
  - [front/src/components/v2/CalendarView_v2.css]: 완료 항목의 배경 투명도를 조절하여 '물러난 디자인'과 가독성 사이의 균형 최적화.

- **v2.53_260212**: 팝업 상태 배지(Pill) 수직 정렬 정밀 보정
  - [front/src/components/v2/CalendarView_v2.jsx]: 배지 내부에 `flex items-center justify-center` 적용 및 고정 높이(`h-[26px]`) 설정.
  - [front/src/components/v2/CalendarView_v2.css]: 팝업 UI 안정화를 위한 보정.

- **v2.55_260212**: [복구 모드] JSX 내 주석 노출 오류 수정
  - [front/src/components/v2/CalendarView_v2.jsx], [front/src/components/v2/Navbar_v2.jsx]:
    - JSX 영역 내에서 일반 주석(`//`)을 사용하여 화면에 텍스트가 노출되던 결함 수정.
    - 모든 주석을 JSX 전용 주석 `{/* */}`으로 전환하여 정상적인 UI 렌더링 복구. (Done)

- **v2.38_260212**: 캘린더 호버 인터랙션 및 팝업 규격 정밀 조정
  - [front/src/components/v2/CalendarView_v2.css]: 호버 시 타일 사이즈 변화(scaling) 및 transition 애니메이션 완전 제거.
  - [front/src/components/v2/CalendarView_v2.css]: 팝업 너비를 타일 2개 분량(`calc(200% + 2px)`)으로 확장하여 정보 노출량 증대.

---

## 1. 작업 목표

- 사용자가 하나의 로컬호스트 주소에서 V1과 V2 기능을 모두 테스트할 수 있도록 통합.
- 백엔드 서버를 각각 독립적으로 실행할 수 있는 구조 제공.

## 2. 세부 작업 내역

- [x] 프론트엔드 진입점 통합 (`index.html`)
- [x] V2 스타일 정합성 확보 (`App.jsx`)
- [x] 백엔드 실행 스크립트 세분화 (`package.json`)

## 3. 실행 방법 (How to Run)

### Backend

- V1 실행 (Port 8000): `cd back && npm run dev:v1`
- V2 실행 (Port 8001): `cd back && npm run dev:v2`

### Frontend

- 통합 실행 (Port 5173): `cd front && npm run dev`
- 접근 경로:
  - V1: `http://localhost:5173/`
  - V2: `http://localhost:5173/v2`
  - Calendar: `http://localhost:5173/v2/calendar`
