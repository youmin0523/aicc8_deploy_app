# API 명세서 (API Specification)

## 개요 (Overview)

본 문서는 To-Do List 애플리케이션의 백엔드 API 명세를 다룹니다. 클라이언트는 JSON 형식으로 데이터를 요청하고 응답받습니다.

- **Base URL**: `http://localhost:8000`
- **Content-Type**: `application/json`

---

## 1. 할 일 조회 (Get Tasks)

특정 사용자의 모든 할 일 목록을 생성일 역순(`created_at DESC`)으로 조회합니다.

- **Endpoint**: `/get_tasks/:userId`
- **Method**: `GET`
- **Parameters**:
  - `userId` (Path Variable): 사용자 식별 ID (Google Login Sub 값)

### Response

- **Status: 200 OK**
- **Body**:
  ```json
  [
    {
      "_id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "React 공부하기",
      "description": "Redux Toolkit 학습",
      "date": "2026-02-03",
      "iscompleted": false,
      "isimportant": true,
      "userid": "google-oauth2|123456789",
      "created_at": "2026-02-03T09:00:00.000Z",
      "updated_at": "2026-02-03T09:00:00.000Z"
    },
    ...
  ]
  ```
- **Status: 500 Internal Server Error**
  - `{ "message": "Get tasks Error: ..." }`

---

## 2. 할 일 생성 (Create Task)

새로운 할 일 항목을 데이터베이스에 저장합니다. `_id`는 서버 측에서 UUID로 자동 생성됩니다.

- **Endpoint**: `/post_task`
- **Method**: `POST`

### Request

- **Body**:
  ```json
  {
    "title": "장보기",
    "description": "우유, 계란, 빵 구매",
    "date": "2026-02-04",
    "isImportant": false,
    "isCompleted": false,
    "userId": "google-oauth2|123456789"
  }
  ```

### Response

- **Status: 201 Created**
  - `{ "msg": "Task Create Successfully" }`
- **Status: 500 Internal Server Error**
  - `{ "msg": "Post Task Failed: ..." }`

---

## 3. 할 일 전체 수정 (Update Task)

기존 할 일의 모든 필드를 수정합니다.

- **Endpoint**: `/update_task`
- **Method**: `PUT`

### Request

- **Body**:
  ```json
  {
    "_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "React 수강 완료",
    "description": "Redux Toolkit 복습 완료",
    "date": "2026-02-03",
    "isImportant": true,
    "isCompleted": true,
    "userId": "google-oauth2|123456789"
  }
  ```

### Response

- **Status: 200 OK**
  - `{ "msg": "Task Updated Successfully" }`
- **Status: 500 Internal Server Error**
  - `{ "msg": "Task Update Failed: ..." }`

---

## 4. 할 일 완료 상태 변경 (Update Completed Status)

할 일의 완료 여부(`isCompleted`)만을 빠르게 토글하거나 변경할 때 사용합니다.

- **Endpoint**: `/update_completed_task`
- **Method**: `PATCH`

### Request

- **Body**:
  ```json
  {
    "itemId": "550e8400-e29b-41d4-a716-446655440000",
    "isCompleted": true
  }
  ```

### Response

- **Status: 200 OK**
  - `{ "msg": "Update Completed Task Successfully" }`
- **Status: 500 Internal Server Error**
  - `{ "msg": "Update Completed Task Failed: ..." }`

---

## 5. 할 일 삭제 (Delete Task)

특정 할 일을 데이터베이스에서 영구적으로 삭제합니다.

- **Endpoint**: `/delete_task/:itemId`
- **Method**: `DELETE`
- **Parameters**:
  - `itemId` (Path Variable): 삭제할 할 일의 UUID

### Response

- **Status: 200 OK**
  - `{ "msg": "Task Deleted Successfully" }`
- **Status: 500 Internal Server Error**
  - `{ "msg": "Delete Task Error: ..." }`
