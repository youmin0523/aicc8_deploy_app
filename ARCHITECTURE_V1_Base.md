# 🏗️ System Architecture: V1 Base & Foundation

**[Technical Specification: v1.5_20260220]**

본 문서는 `aicc8_deploy_app`의 기틀이 되는 V1 시스템의 물리적 구조, 데이터 흐름 및 핵심 비즈니스 로직을 상세히 기술합니다.

---

## 1. Directory Structure & Dependency Analysis

### 1.1 Frontend (V1 Core)

- **`front/src/components/Common/`**
  - `Navbar.jsx`: 사이드바 레이아웃 및 인증 상태 UI 브릿지.
  - `ItemPanel.jsx`: 메인 대시보드의 데이터 패칭 및 필터링 오케스트레이션.
  - `Item.jsx`: 할 일 개별 항목의 렌더링 및 인터랙션(Toggle, Delete) 담당.
- **`front/src/redux/slices/`**
  - `authSlice.js`: JWT Decode 및 로그인 세션 영속성 관리.
  - `taskSlice.js`: V1 할 일 데이터의 비동기 CRUD(Thunk) 정의.

### 1.2 Backend (V1 API)

- **`back/routes/getRoutes.js`**: `userId` 기반의 태스크 조회 엔드포인트.
- **`back/controllers/getControllers.js`**: `SELECT` 쿼리 및 데이터 정렬 로직.
- **`back/database/db.js`**: PostgreSQL 커넥션 풀(Pool) 관리 및 기본 SQL 쿼리 실행기.

---

## 2. [Deep-Dive] Data Life-cycle (V1)

### 2.1 인증 및 세션 데이터 흐름

1. **Login**: 구글 로그인을 통해 `id_token` 수신.
2. **Decode**: `jwt-decode`를 통해 사용자 고유 식별자(`sub`) 추출.
3. **Persist**: `authSlice` 및 `localStorage`에 저장하여 새로고침 후에도 세션 유지.
4. **Authorize**: 모든 API 요청 시 `userId`로 `sub` 값을 전달하여 데이터 격리 수행.

### 2.2 태스크 조회 및 렌더링 경로 (Execution Map)

`ItemPanel:useEffect` -> `dispatch(getTasks)` -> `axios.get(/get_tasks/:userId)` -> `controller:db.query` -> `redux:fulfilled` -> `Item:render`

---

## 3. [Traceability] 핵심 기술적 의사결정 (V1)

### 3.1 Responsive Flex-Grid 시스템

- **이슈**: 미디어 쿼리만으로는 부족한 카드 레이아웃의 유동성 문제.
- **해결**: `flex-wrap`과 `w-full/w-1/2/w-1/3`을 변곡점(768px/1024px)에 따라 조건부 렌더링하여 CLS를 최소화함.

### 3.2 데이터 격리(Data Isolation) 원칙

- **이슈**: 멀티 유저 환경에서 데이터가 섞일 위험성.
- **해결**: API 서버의 모든 엔드포인트에서 `userId` 파라미터를 필수로 요구하며, SQL 쿼리 시 `WHERE userId = $1` 파라미터 바인딩을 강제함.

---

## 4. 정밀 검증 시나리오 (Verification)

- [x] 비로그인 유저가 `/` 경로 진입 시 로그인 유도 화면 정상 노출 여부.
- [x] 사이드바 토글 시 메인 영역 아이템들의 가로 크기가 부드럽게 재계산되는지 확인.
- [x] 특정 유저가 다른 유저의 `userId`를 API에 담아 보냈을 때 접근 차단 가능 여부(Auth 미들웨어).
