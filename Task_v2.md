# Task: V2 Evolution - Advanced Productivity Suite (Calendar & Categories)

## Revision History

**[Current Revision: v3.2_260211]**

- **v3.2_260211**: Parallel Architecture Setup (V2 Evolution Start)
  - [back/database/database_v2.sql]
    - **추가**: 신규 `categories` 테이블 및 확장된 `tasks_v2` (due_date TIMESTAMP 포함) 정의 완료.
  - [back/controllers/categoryControllers_v2.js]
    - **추가**: 카테고리 CRUD 로직 구현.
  - [back/controllers/taskControllers_v2.js]
    - **추가**: 마감 시간 및 카테고리 JOIN을 포함한 확장된 할 일 관리 로직 구현.
  - [back/routes/categoryRoutes_v2.js] & [back/routes/taskRoutes_v2.js]
    - **추가**: V2 전용 API 엔드포인트 설정 완료.
  - [back/index.js]
    - **수정**: V2 신규 라우트 등록 완료.

---

## 1. Feature List (V2 Advanced Suite)

| 기능명                    | 설명                                        | 비고               |
| :------------------------ | :------------------------------------------ | :----------------- |
| **Category System**       | 전용 테이블 기반의 커스텀 태그 및 컬러 매칭 | `database_v2.sql`  |
| **Due Date Time**         | `TIMESTAMP` 기반의 초단위 마감 기한 관리    | `tasks_v2`         |
| **Color Calendar**        | 카테고리 색상이 반영된 시각적 일정표        | `CalendarView.jsx` |
| **Parallel Architecture** | 기존 파일 유지하며 v2 전용 파일로 작업      | **Safety**         |

---

## 2. Action Plan (V2 Evolution)

- [x] V2 병렬 개발 전략 수립 및 파일 트리 설계 (Total Isolation)
- [x] **[Back]** `back/database/database_v2.sql` 생성 및 테이블 정의
- [x] **[Back]** 카테고리 관리 API 엔드포인트 구축
- [x] **[Back]** 확장된 태스크 관리 API 구축
- [x] **[Back]** `back/index_v2.js` (신규 엔트리포인트) 생성 완료
- [x] **[Front]** Redux V2 시스템 구축 완료
- [x] **[Front]** V2 기본 UI 레이아웃 구축 완료
- [x] **[Front]** `main_v2.jsx` 및 `App_v2.jsx` 생성 완료
- [x] **[Front]** `CalendarView_v2.jsx` (카테고리 연동 프리미엄 캘린더) 개발 완료
- [x] **[Front]** `Modal_v2.jsx` (시간/카테고리/태그 정밀 편집) 개발 완료
- [ ] **[Back]** V2 전용 서버 테스트 및 검증

---

## 3. Architecture Note (V2)

- **Isolation**: V2 기능은 기존 `tasks` 테이블이 아닌 `tasks_v2` 테이블을 사용합니다.
- **Precision**: `due_date`는 `TIMESTAMP`를 사용하여 시간 단위까지 정밀하게 관리합니다.
- **Relational**: `tasks_v2`는 `categoryId`를 통해 `categories` 테이블과 관계를 맺습니다.
