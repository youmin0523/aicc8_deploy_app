# 프로젝트 기능 명세서 (Project Feature Specifications)

## 1. 프로젝트 개요 (Overview)

본 프로젝트는 **React** 기반의 프론트엔드와 **Express.js + PostgreSQL** 기반의 백엔드로 구성된 **개인 일정 관리 웹 애플리케이션(To-Do List)**입니다. 사용자별 인증을 지원하며, 할 일의 생성, 조회, 수정, 삭제(CRUD) 기능을 제공합니다. 테마는 **다크 모드**를 기본으로 채택하여 모던한 디자인을 지향합니다.

### 🛠 기술 스택 (Tech Stack)

| 구분 (Category)         | 기술 (Technology)                                   | 설명 (Description)                                        |
| :---------------------- | :-------------------------------------------------- | :-------------------------------------------------------- |
| **Frontend Framework**  | React (Vite)                                        | 빠르고 가벼운 SPA(Single Page Application) 개발 환경 제공 |
| **State Management**    | Redux Toolkit                                       | 사용자 인증 정보, 모달 상태, API 데이터 전역 관리         |
| **Styling**             | TailwindCSS                                         | 유틸리티 클래스 기반의 빠르고 일관된 디자인 시스템 적용   |
| **Routing**             | React Router DOM                                    | 페이지 간 이동 및 URL에 따른 컴포넌트 렌더링 관리         |
| **UI Components**       | React Icons, React Toastify, React Loading Skeleton | 아이콘, 알림 메시지, 로딩 스켈레톤 등 UX 향상 라이브러리  |
| **Backend Environment** | Node.js                                             | 자바스크립트 런타임 환경                                  |
| **Web Framework**       | Express.js                                          | RESTful API 서버 구축을 위한 웹 프레임워크                |
| **Database**            | PostgreSQL                                          | 안정적이고 강력한 관계형 데이터베이스 시스템              |
| **Authentication**      | Google OAuth 2.0 (@react-oauth/google)              | 보안성 높은 소셜 로그인 기능 및 JWT(JSON Web Token) 활용  |
| **HTTP Client**         | Fetch API (Wrapper)                                 | 백엔드와의 비동기 통신 처리                               |

---

## 2. 상세 기능 명세 (Detailed Features)

### 🔐 2.1 인증 시스템 (Authentication)

사용자 식별을 위해 Google OAuth를 사용하며, 별도의 회원가입 절차 없이 소셜 로그인만으로 서비스를 이용할 수 있습니다.

- **Google 로그인**:
  - `@react-oauth/google` 라이브러리를 사용하여 구현.
  - 로그인 성공 시 Google 서버로부터 받은 Credential(JWT)을 `jwt-decode`로 디코딩하여 사용자 정보(Sub: 고유 ID, Name: 이름 등)를 획득.
  - 획득한 사용자 정보는 Redux Store(`authSlice`)에 저장되어 전역 상태로 관리.
- **접근 제어 (Access Control)**:
  - 로그인 상태(`isAuth`)에 따라 UI가 변경.
  - 비로그인 시: "로그인이 필요한 서비스입니다." 문구와 구글 로그인 버튼 표시.
  - 로그인 시: 사용자의 이름과 할 일 목록, 아이템 추가 패널 표시.
- **로그아웃**:
  - Redux Store의 인증 정보를 초기화하여 로그아웃 처리.

### 📋 2.2 할 일 관리 (Task Management)

할 일 데이터는 RDBMS(PostgreSQL)에 저장되며, 실시간에 준하는 데이터 동기화를 제공합니다.

#### 1) 할 일 생성 (Create)

- **UI**: 우측 상단 또는 리스트 최하단의 '할 일 추가하기' 버튼 클릭 시 모달창 활성화.
- **입력 필드**:
  - `Title`: 할 일 제목 (필수).
  - `Date`: 마감일 또는 수행일 (YYYY-MM-DD 포맷).
  - `Description`: 상세 내용 (Textarea).
  - `Select Options`: '중요' 여부 / '완료' 여부 체크박스.
- **로직**:
  - 입력된 데이터를 `POST /post_task` API로 전송.
  - 백엔드에서 `uuidv4()`를 통해 고유 `_id` 생성 후 DB 저장.
  - 저장 성공 시 알림 메시지 표시 및 목록 갱신.

#### 2) 할 일 조회 및 필터링 (Read & Filtering)

사용자는 선택한 메뉴에 따라 필터링된 할 일 목록을 확인할 수 있습니다. 필터링 로직은 프론트엔드(`ItemPanel.jsx`)에서 수행됩니다.

- **필터링 상세 로직**:
  1.  **1차 필터 (완료 여부)**:
      - `Home`: 모든 상태의 태스크를 통과 (`filteredCompleted === 'all'`).
      - `Completed`: `isCompleted`가 `true`인 태스크만 통과.
      - `Proceeding`: `isCompleted`가 `false`인 태스크만 통과.
  2.  **2차 필터 (중요 여부)**:
      - 1차 필터를 통과한 태스크 중, `Important` 메뉴인 경우 `isImportant`가 `true`인 항목만 최종적으로 표시.
      - 그 외 메뉴는 중요 여부와 상관없이 표시.

#### 3) 할 일 수정 (Update)

- **전체 수정**:
  - 기존 아이템 카드 클릭 시 수정 모달 팝업.
  - `PUT /update_task` API를 호출하여 제목, 내용, 날짜, 상태 등 전체 필드 업데이트.
- **부분 수정 (상태 토글)**:
  - 리스트 상의 버튼 클릭만으로 즉시 상태 변경.
  - **완료 토글**: `PATCH /update_completed_task` 호출 (완료 ↔ 미완료).
  - **중요 토글**: 아이템 수정 로직 내에서 처리 가능.

#### 4) 할 일 삭제 (Delete)

- **UI**: 아이템 카드의 삭제 아이콘(휴지통) 클릭.
- **로직**:
  - `DELETE /delete_task/:itemId` API 호출.
  - 삭제 확인 후 DB에서 영구 제거 및 UI 리스트에서 즉시 제거.

### 🎨 2.3 UI/UX 및 페이지 구조 (Page Structure)

- **레이아웃**:
  - **Sidebar**: 좌측 고정 네비게이션 (반응형 지원).
  - **Main Panel**: 우측 컨텐츠 영역, 스크롤 가능한 리스트 뷰.
- **페이지 라우팅 구조**:

| 경로 (Path)   | 컴포넌트 (Component) | 설명 (Description) | 필터 조건 (Filter Condition)               |
| :------------ | :------------------- | :----------------- | :----------------------------------------- |
| `/`           | `Home`               | 전체 대시보드      | **All Tasks** (모든 할 일 표시)            |
| `/completed`  | `Completed`          | 완료된 항목        | **Completed Only** (`isCompleted: true`)   |
| `/proceeding` | `Proceeding`         | 진행 중 항목       | **Incomplete Only** (`isCompleted: false`) |
| `/important`  | `Important`          | 중요 항목          | **Important Only** (`isImportant: true`)   |

- **Styling**:
  - TailwindCSS를 활용한 유틸리티 클래스 기반 스타일링.
  - 다크 테마 (`bg-[#212121]` 등) 적용.
  - 부드러운 색상 팔레트와 둥근 모서리(`rounded-md`) 디자인.
- **인터랙션**:
  - 버튼 Hover 효과, 모달 등장 애니메이션 등.
  - `react-toastify`를 이용한 작업 결과 피드백(성공/실패 메시지) 제공.

---

## 3. 데이터베이스 스키마 (Database Schema)

**PostgreSQL**을 사용하며, 단일 테이블 `tasks`로 구성됩니다.

| Field Name    | Type      | Key | Default  | Description              |
| :------------ | :-------- | :-: | :------- | :----------------------- |
| `_id`         | TEXT      | PK  | -        | UUID (고유 식별자)       |
| `title`       | TEXT      |  -  | NOT NULL | 할 일 제목               |
| `description` | TEXT      |  -  | NOT NULL | 상세 내용                |
| `date`        | TEXT      |  -  | NOT NULL | 날짜 문자열              |
| `isCompleted` | BOOLEAN   |  -  | false    | 완료 여부                |
| `isImportant` | BOOLEAN   |  -  | false    | 중요 여부                |
| `userId`      | TEXT      |  -  | NOT NULL | 소유자 ID (Google Sub)   |
| `created_at`  | TIMESTAMP |  -  | NOW()    | 생성 일시                |
| `updated_at`  | TIMESTAMP |  -  | NOW()    | 수정 일시 (Trigger 적용) |

---

## 4. 디렉토리 구조 (Directory Structure)

```
root/
├── back/                   # Backend (Express)
│   ├── controllers/        # 비즈니스 로직 핸들러
│   ├── database/           # DB 연결 및 SQL 스키마
│   ├── routes/             # API 라우팅 정의
│   └── index.js            # 서버 엔트리 포인트
│
└── front/                  # Frontend (React)
    ├── src/
    │   ├── components/     # 재사용 가능한 UI 컴포넌트
    │   ├── redux/          # Redux Store & Slices
    │   ├── utils/          # 상수, 헬퍼 함수, API URL
    │   ├── App.jsx         # 라우팅 설정
    │   └── main.jsx        # 앱 엔트리 포인트
    └── index.html
```
