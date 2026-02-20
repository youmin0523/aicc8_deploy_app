# 🏗️ System Architecture: V2 Dashboard & Private Space Hub

**[Technical Specification: v2.5_20260220]**

본 문서는 V2 프리미엄 대시보드와 Private Space(라이프로그) 시스템의 복합적인 아키텍처 및 데이터 상호작용을 상세히 기술합니다.

---

## 1. Directory Structure & File Relationships

### 1.1 Frontend (V2 Premium)

- **`front/src/components/v2/`**
  - `Home_v2.jsx`: 카테고리 필터링이 기능이 추가된 고도화 대시보드.
  - `CalendarView_v2.jsx`: 카테고리 컬러 닷(Dot) 렌더링 엔진 탑재 캘린더.
  - **`PrivateCalendar/`**
    - `PrivateCalendarMain.jsx`: Hero View 레이아웃을 정의하는 Hub.
    - `CalendarTab.jsx`: 타일 높이(`78px`) 및 시인성이 최적화된 메인 캘린더.
    - `DiaryTab.jsx`: `Upsert` 로직이 적용된 장문 일기 작성기.

### 1.2 Backend (V2 Logic)

- **`back/routes/privateCalendarRoutes.js`**: Private 복합 데이터 도메인 라우팅.
- **`back/controllers/privateCalendarControllers.js`**: 다이어리(`JSONB`), 습관(`Log-Join`), 일정(`Attachments`) 처리 로직.

---

## 2. [Deep-Dive] Data Life-cycle (V2/Private)

### 2.1 Private Space 동기화 매커니즘

1. **Selection**: 사용자가 캘린더 날짜 클릭 -> Redux `selectedDate` 갱신.
2. **Side Effect**: `selectedDate`를 구독하는 `useEffect`가 `fetchDiary` 및 `fetchHabits` Thunk 실행.
3. **Database Operation**: PostgreSQL `private_diaries`에서 날짜 매칭 조회.
4. **Rendering**: Redux `fulfilled` 수신 후 글래스모피즘 레이어에 다이어리 내용 실시간 바인딩.

### 2.2 카테고리 컬러 파이프라인

카테고리에 설정된 HEX 값이 백엔드에서 프론트엔드의 캘린더 마커와 리스트 컬러로 전이되는 과정입니다:
`DB: categories.color` -> `API Response` -> `categorySlice` -> `CalendarView:TileContent` -> `CSS Variable` 적용.

---

## 3. [Traceability] 핵심 기술적 의사결정 (V2)

### 3.1 수직 압축 렌더링 전략 (Vertical Precision Tuning)

- **이슈**: 84px 그리드와 4xl 헤더가 노트북 해상도에서 6주차 달력을 짤리게 함.
- **해결**:
  - `PrivateCalendarMain.jsx`: 제목 폰트 스케일링(`text-25px`) 및 상단 마진 압축.
  - `CalendarTab.jsx`: 캘린더 행 높이 `78px`로 정밀 튜닝 (1080p 해상도 가시성 100% 확보).

### 3.2 병렬 트리 아키텍처 (Generation Isolation)

- **이슈**: V2 도입 시 V1 사용자들의 경험 훼손 방지 필요.
- **해결**: 모든 V2 컴포넌트는 전용 폴더(`v2/`)와 전용 라우트(`/v2/*`)를 사용하며, Redux 상태 역시 독립된 슬라이스로 운영하여 세대 간 간섭 제거.

---

## 4. 정밀 검증 시나리오 (Verification)

- [x] 6주차가 있는 달(예: 3월) 선택 시 다이어리 저장 버튼까지 스크롤 없이 노출되는지 확인.
- [x] 카테고리 색상 변경 시 캘린더 타일 위의 닷(Dot) 색상이 실시간으로 동기화되는지 체크.
- [x] 이미지 첨부 시 Base64 문자열이 DB의 `JSONB` 필드에 무결하게 저장 및 출력되는지 확인.
