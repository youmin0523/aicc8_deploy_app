# API 명세서 (API Specification v1.0)

## 1. 개요 (Overview)

본 문서는 **To-Do List 애플리케이션**의 백엔드 API 명세를 다룹니다. 클라이언트는 JSON 형식으로 데이터를 요청하고 응답받습니다.

- **Base URL**: `http://localhost:8000`
- **Protocol**: HTTP/1.1
- **Data Format**: JSON (application/json)

## 2. 공통 사항 (Common Info)

### HTTP Status Codes

| Code  | Description           | 의미                                          |
| :---- | :-------------------- | :-------------------------------------------- |
| `200` | OK                    | 요청이 성공적으로 처리됨                      |
| `201` | Created               | 리소스가 성공적으로 생성됨                    |
| `400` | Bad Request           | 클라이언트의 요청이 잘못됨 (파라미터 누락 등) |
| `404` | Not Found             | 리소스를 찾을 수 없음                         |
| `500` | Internal Server Error | 서버 내부 오류 발생                           |

### Error Response Format

오류 발생 시 다음과 같은 JSON 구조를 반환합니다.

```json
{
  "msg": "에러 메시지 상세 내용",
  "error": "상세 에러 로그 (Optional)"
}
```

---

## 3. Endpoints

### 3.1. 할 일 목록 조회 (Get Tasks)

특정 사용자의 모든 할 일 목록을 생성일 역순(`created_at DESC`)으로 조회합니다.

- **URL**: `/get_tasks/:userId`
- **Method**: `GET`
- **Description**: `userId`에 해당하는 사용자의 모든 태스크를 가져옵니다.

#### Path Parameters

| Name     | Type     | Required | Description                        |
| :------- | :------- | :------- | :--------------------------------- |
| `userId` | `string` | **Yes**  | 사용자 고유 식별자 (Google Sub 값) |

#### Success Response (200 OK)

```json
[
  {
    "_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "React 학습",
    "description": "Redux Toolkit 및 미들웨어 학습",
    "date": "2026-02-03",
    "iscompleted": false,
    "isimportant": true,
    "userid": "google-oauth2|1000",
    "created_at": "2026-02-03T09:00:00.000Z",
    "updated_at": "2026-02-03T09:00:00.000Z"
  },
  {
    "_id": "670e8400-e29b-41d4-a716-446655441111",
    "title": "운동하기",
    "description": "헬스장 가기",
    "date": "2026-02-03",
    "iscompleted": true,
    "isimportant": false,
    "userid": "google-oauth2|1000",
    "created_at": "2026-02-02T18:00:00.000Z",
    "updated_at": "2026-02-02T19:30:00.000Z"
  }
]
```

---

### 3.2. 할 일 생성 (Create Task)

새로운 할 일 항목을 생성합니다.

- **URL**: `/post_task`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body

| Field         | Type      | Required | Description                |
| :------------ | :-------- | :------- | :------------------------- |
| `title`       | `string`  | **Yes**  | 할 일 제목                 |
| `description` | `string`  | No       | 상세 내용 (빈 문자열 허용) |
| `date`        | `string`  | **Yes**  | 수행 날짜 (YYYY-MM-DD)     |
| `isImportant` | `boolean` | **Yes**  | 중요 여부                  |
| `isCompleted` | `boolean` | **Yes**  | 완료 여부                  |
| `userId`      | `string`  | **Yes**  | 소유자 ID (Google Sub)     |

#### Example Request

```json
{
  "title": "프로젝트 배포하기",
  "description": "Vercel을 통해 프론트엔드 배포",
  "date": "2026-02-10",
  "isImportant": true,
  "isCompleted": false,
  "userId": "google-oauth2|123456789"
}
```

#### Success Response (201 Created)

```json
{
  "msg": "Task Create Successfully"
}
```

---

### 3.3. 할 일 전체 수정 (Update Task)

기존 할 일의 모든 정보를 업데이트합니다.

- **URL**: `/update_task`
- **Method**: `PUT`
- **Content-Type**: `application/json`

#### Request Body

| Field         | Type      | Required | Description          |
| :------------ | :-------- | :------- | :------------------- |
| `_id`         | `string`  | **Yes**  | 수정할 태스크의 UUID |
| `title`       | `string`  | **Yes**  | 제목                 |
| `description` | `string`  | No       | 상세 내용            |
| `date`        | `string`  | **Yes**  | 날짜                 |
| `isImportant` | `boolean` | **Yes**  | 중요 여부            |
| `isCompleted` | `boolean` | **Yes**  | 완료 여부            |

#### Example Request

```json
{
  "_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "React 학습 (수정됨)",
  "description": "Redux Toolkit 심화 학습",
  "date": "2026-02-05",
  "isImportant": false,
  "isCompleted": true
}
```

#### Success Response (200 OK)

```json
{
  "msg": "Task Updated Successfully"
}
```

---

### 3.4. 할 일 완료 상태 변경 (Patch Task Status)

할 일의 완료 여부(`isCompleted`)만 부분적으로 수정합니다.

- **URL**: `/update_completed_task`
- **Method**: `PATCH`
- **Content-Type**: `application/json`

#### Request Body

| Field         | Type      | Required | Description                                                              |
| :------------ | :-------- | :------- | :----------------------------------------------------------------------- |
| `itemId`      | `string`  | **Yes**  | 수정할 태스크의 UUID (**Note**: 필드명이 `_id`가 아닌 `itemId`임에 주의) |
| `isCompleted` | `boolean` | **Yes**  | 변경할 완료 상태 값                                                      |

#### Example Request

```json
{
  "itemId": "550e8400-e29b-41d4-a716-446655440000",
  "isCompleted": true
}
```

#### Success Response (200 OK)

```json
{
  "msg": "Update Completed Task Successfully"
}
```

---

### 3.5. 할 일 삭제 (Delete Task)

특정 할 일을 DB에서 영구 삭제합니다.

- **URL**: `/delete_task/:itemId`
- **Method**: `DELETE`

#### Path Parameters

| Name     | Type     | Required | Description          |
| :------- | :------- | :------- | :------------------- |
| `itemId` | `string` | **Yes**  | 삭제할 태스크의 UUID |

#### Success Response (200 OK)

```json
{
  "msg": "Task Deleted Successfully"
}
```

#### Error Response (500 Internal Server Error)

```json
{
  "msg": "Delete Task Error: [Error Message]"
}
```
