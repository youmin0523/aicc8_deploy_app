# 📡 API Specification: Integrated Life-Management Protocol

**[Latest Revision: v2.8_20260220]**

본 문서는 `aicc8_deploy_app` 프로젝트에서 제공하는 모든 API 엔드포인트에 대한 기술 규격과 통신 프로토콜을 정의합니다. 모든 API는 RESTful 원칙을 준수하며, JSON 형식으로 데이터를 교환합니다.

---

## 🚦 1. General Protocol Information

### 🔗 Base Endpoint & Meta

- **Protocol**: HTTPS / HTTP 1.1
- **Base URL**: `http://localhost:8000`
- **Content-Type**: `application/json; charset=utf-8`
- **Auth Strategy**: Google OAuth2 `sub`(Unique User Key)를 기반으로 데이터 격리를 수행합니다. 클라이언트는 모든 요청에 `userId` 파라미터를 포함해야 합니다.

### 🚦 Error Handling Strategy

에러 발생 시 아래와 같은 형식을 반환하며, 클라이언트는 `msg` 필드를 사용자 경고로 활용해야 합니다.

```json
{
  "msg": "에러 발생 원인",
  "status": 500,
  "error": "상세 에러 로그 (개발 모드 전용)"
}
```

---

## 📋 2. Task (Generation 1) Domain

기본 할 일 관리(Task)와 관련된 API군입니다.

### 2.1 [GET] 할 일 전수 조회

특정 사용자의 모든 업무를 `created_at` 내림차순(최신순)으로 조회합니다.

- **URL**: `/get_tasks/:userId`
- **Method**: `GET`
- **Parameters (Path)**:
  - `userId`: `string (Required)` - 유저의 고유 식별자 (`sub`)
- **Success Response (200 OK)**:
  ```json
  [
    {
      "_id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "업무 제목",
      "description": "업무 상세 내용",
      "date": "2024-05-20",
      "isCompleted": false,
      "isImportant": true,
      "userId": "google-oauth2|123",
      "created_at": "2024-05-20T10:00:00.000Z"
    }
  ]
  ```

### 2.2 [POST] 할 일 생성

새로운 할 일을 등록합니다. `_id`는 서버에서 UUID로 자동 생성됩니다.

- **URL**: `/post_task`
- **Request Body**:
  ```json
  {
    "title": "string (Required)",
    "description": "string (Optional)",
    "date": "YYYY-MM-DD",
    "isCompleted": boolean,
    "isImportant": boolean,
    "userId": "string (Required)"
  }
  ```

### 2.3 [PATCH] 완료 상태 토글

기존 업무의 `isCompleted` 상태만 즉각적으로 업데이트합니다.

- **URL**: `/update_completed_task`
- **Request Body**:
  ```json
  {
    "itemId": "string (Required)",
    "isCompleted": boolean (Required)
  }
  ```

---

## 📋 3. Private Space (Life-Log) Domain

다이어리, 습관, 일정 등 개인화된 라이프로그 API군입니다.

### 3.1 [GET/POST] 다이어리 통합 관리 (Upsert)

사용자의 일기를 조회하거나 저장합니다. 저장 시 해당 날짜에 데이터가 이미 있으면 **Update**, 없으면 **Insert**를 수행합니다.

- **조회 URL**: `GET /api/v2/private/diary?userId={userId}&date={YYYY-MM-DD}`
- **저장 URL**: `POST /api/v2/private/diary`
- **Request Body (Save)**:
  ```json
  {
    "userId": "string (Required)",
    "entry_date": "YYYY-MM-DD (Required)",
    "content": "text/markdown (Required)",
    "images": [
      { "name": "file.png", "url": "base64_string", "type": "image/png" }
    ]
  }
  ```

### 3.2 [POST] 습관 달성 트래커 활성화

특정 날짜의 습관 수행 유무를 기록합니다.

- **URL**: `/api/v2/private/habits/toggle`
- **Request Body**:
  ```json
  {
    "habitId": "uuid-string (Required)",
    "date": "YYYY-MM-DD (Required)",
    "isCompleted": boolean (Required),
    "userId": "string (Required)"
  }
  ```

### 3.3 [POST] 복합 일정 등록 (Schedule)

첨부파일과 장소 정보를 포함한 스케줄을 저장합니다.

- **URL**: `/api/v2/private/schedules`
- **Request Body**:
  ```json
  {
    "title": "일정 제목",
    "start_date": "ISO-8601 Timestamp",
    "end_date": "ISO-8601 Timestamp",
    "is_anniversary": boolean,
    "place": "string (optional)",
    "attachments": "JSONB object {name, url, type}"
  }
  ```

---

## 📋 4. Categories Domain

업무 그룹화를 위한 카테고리 관리 API군입니다.

### 4.1 [GET] 사용자 정의 카테고리 목록 조회

사용자가 생성한 모든 카테고리와 기본 카테고리를 반환합니다.

- **URL**: `/api/v2/categories/:userId`
- **Success Response**:
  ```json
  [{ "id": "uuid", "name": "Work", "color": "#FF0000", "userId": "..." }]
  ```

---

## 🚦 5. Frontend Integration Guide (UI Event Mapping)

프론트엔드 액션과 API 엔드포인트 간의 매핑 명세입니다.

| UI Action (User) | UI Element     | API Endpoint (Backend)       | Redux Effect (State)              |
| :--------------- | :------------- | :--------------------------- | :-------------------------------- |
| **날짜 클릭**    | Calendar Tile  | `GET /diary`, `GET /habits`  | `selectedDate` 및 콘텐츠 로드     |
| **기록 동기화**  | Save Button    | `POST /api/v2/private/diary` | `isSyncing: true` -> `false`      |
| **체크 표시**    | Habit Checkbox | `POST /habits/toggle`        | `habits[i].is_completed` 반전     |
| **버전 전환**    | Upgrade to V2  | (Client Side Routing)        | `VersionLoader` 페이드 애니메이션 |

---

**[Final Notice]** 본 명세서는 프론트엔드와 백엔드 간의 불변의 약속(Immutable Contract)입니다. 모든 데이터 형식 변경 시 반드시 이 문서를 선행 업데이트해야 합니다.
