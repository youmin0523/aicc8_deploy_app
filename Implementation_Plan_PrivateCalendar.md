# Implementation Plan: Private Calendar System

## 1. 개요 (Overview)

본 계획서는 사용자의 개인적인 생활을 기록하고 관리할 수 있는 **Private Calendar** 모듈의 기술적 구현 상세를 다룹니다. 업무 중심의 기존 시스템과 분리된 데이터 구조를 가지며, '다이어리'와 '습관' 기능을 중심으로 1차 구현을 진행합니다.

## 2. 데이터 아키텍처 (Data Architecture)

### 2.1 데이터베이스 스키마 (PostgreSQL)

#### Table: `private_diaries`

| Column       | Type        | Description              |
| :----------- | :---------- | :----------------------- |
| `id`         | TEXT (UUID) | 기본 키                  |
| `userId`     | TEXT        | 사용자 ID (Foreign Key)  |
| `entry_date` | DATE        | 기록 날짜 (사용자 선택)  |
| `content`    | TEXT        | 일기 내용                |
| `images`     | JSONB       | 사진 URL 배열 (최대 N개) |
| `created_at` | TIMESTAMP   | 생성 일시                |
| `updated_at` | TIMESTAMP   | 수정 일시                |

#### Table: `private_habits`

| Column            | Type        | Description                       |
| :---------------- | :---------- | :-------------------------------- |
| `id`              | TEXT (UUID) | 기본 키                           |
| `userId`          | TEXT        | 사용자 ID                         |
| `habit_name`      | TEXT        | 습관 명칭 (예: 아침 명상)         |
| `start_time`      | TIME        | 시작 시간                         |
| `end_time`        | TIME        | 종료 시간 (선택)                  |
| `repeat_type`     | TEXT        | 반복 유형 (Daily, Weekly, Custom) |
| `repeat_days`     | INT[]       | 반복 요일 (0-6, Sunday-Saturday)  |
| `goal_start_date` | DATE        | 목표 시작일                       |
| `goal_end_date`   | DATE        | 목표 종료일                       |
| `reminder_time`   | TIME        | 알림 시간                         |
| `is_active`       | BOOLEAN     | 활성화 여부                       |

#### Table: `private_habit_logs`

| Column       | Type    | Description  |
| :----------- | :------ | :----------- |
| `id`         | SERIAL  | 기본 키      |
| `habit_id`   | TEXT    | 습관 ID (FK) |
| `check_date` | DATE    | 완료 날짜    |
| `status`     | BOOLEAN | 달성 여부    |

## 3. 백엔드 구현 전략 (Backend Strategy)

### 3.1 API Endpoint 설계

- `POST /api/v2/private/diary`: 다이어리 생성/수정 (Upsert)
- `GET /api/v2/private/diary?date=YYYY-MM-DD`: 특정 날짜 다이어리 조회
- `GET /api/v2/private/habits`: 전체 습관 리스트 조회
- `POST /api/v2/private/habits`: 신규 습관 등록
- `PATCH /api/v2/private/habits/:id/check`: 습관 완료 체크

### 3.2 이미지 처리

- 1차: Base64 또는 임시 URL 처리
- 2차(확장): Multer를 이용한 로컬 스토리지 또는 S3 연동

## 4. 프론트엔드 구현 전략 (Frontend Strategy)

### 4.1 컴포넌트 구조

- `PrivateCalendarMain`: 메인 레이아웃 및 상단 탭 (Diary, Habit, To-Do, Schedule)
- `DiaryPanel`: 텍스트 에디터 및 이미지 업로드 UI
- `HabitPanel`: 프리셋 선택 리스트 및 설정 모달
- `HabitSettingsModal`: 시간/주기/알림 정밀 설정

### 4.2 상태 관리 (Redux)

- `privateCalendarSlice`: `diaries`, `habits`, `selectedDate` 등의 상태 관리.
- 비동기 Thunk를 통한 API 연동.

## 5. UI/UX 디자인 원칙

- **Premium Aesthetics**: 네이버 캘린더의 깔끔함을 기반으로 하되, 다크 모드와 글래스모피즘을 적용하여 고급스러운 느낌 강조.
- **Micro-animations**: 습관 체크 시의 만족감을 주는 스파클링 효과 또는 부드러운 트랜지션 추가.

## 6. 리스크 및 대응방안 ([주의])

- **데이터 유실**: 다이어리 작성 중 자동 저장(Auto-save) 기능 검토 필요.
- **이미지 용량**: 업로드 시 클라이언트 측에서 압축 처리 로직 필요.
- **포트 충돌**: V1(8000), V2(8001) 환경을 유지하며 신규 라우트가 정상적으로 로드되는지 확인.
