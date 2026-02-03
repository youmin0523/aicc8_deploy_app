# API 명세서 (API Specification)

## Base URL

`http://localhost:8000` (개발 환경 기준)

## 1. 할 일 조회 (Get Tasks)

- **Endpoint**: `/get_tasks/:userId`
- **Method**: `GET`
- **Description**: 특정 사용자의 모든 할 일 목록을 가져옵니다.
- **URL Parameters**:
  - `userId`: 사용자 고유 식별자 (Google 로그인 sub 값 등)
- **Response**:
  - Success (200): 할 일 객체의 배열 반환.

## 2. 할 일 추가 (Post Task)

- **Endpoint**: `/post_task`
- **Method**: `POST`
- **Description**: 새로운 할 일을 생성합니다.
- **Request Body**:
  ```json
  {
    "title": "string",
    "date": "string (YYYY-MM-DD)",
    "description": "string",
    "isImportant": boolean,
    "isCompleted": boolean,
    "userId": "string"
  }
  ```
- **Response**:
  - Success: 생성된 할 일 객체 또는 성공 메시지.

## 3. 할 일 수정 (Update Task)

- **Endpoint**: `/update_task`
- **Method**: `PUT`
- **Description**: 기존 할 일의 내용을 전체 수정합니다.
- **Request Body**:
  ```json
  {
    "_id": "string (Task ID)",
    "title": "string",
    "date": "string",
    "description": "string",
    "isImportant": boolean,
    "isCompleted": boolean,
    "userId": "string"
  }
  ```
- **Response**:
  - Success: 수정된 할 일 객체 또는 성공 메시지.

## 4. 할 일 완료 상태 변경 (Update Completed Task)

- **Endpoint**: `/update_completed_task`
- **Method**: `PATCH`
- **Description**: 할 일의 완료 여부(`isCompleted`)만 부분 수정합니다.
- **Request Body**:
  ```json
  {
    "id": "string (Task ID)",
    "isCompleted": boolean
  }
  ```
- **Response**:
  - Success: 성공 메시지.

## 5. 할 일 삭제 (Delete Task)

- **Endpoint**: `/delete_task/:itemId`
- **Method**: `DELETE`
- **Description**: 특정 할 일을 삭제합니다.
- **URL Parameters**:
  - `itemId`: 삭제할 할 일의 고유 ID
- **Response**:
  - Success: 성공 메시지.
