# Implementation Plan: Daily Life Log UI Enhancement (v1.0)

## 1. 아키텍처 및 데이터 흐름

### 파일 간 의존성

- `CalendarTab.jsx`: Daily Life Log UI의 핵심 구조와 로직을 담당 (L205-283).
- `CalendarView_v2.css`: 전역 및 컴포넌트 전용 스타일 정의.
- `privateCalendarSlice.js`: 다이어리 데이터(상태) 관리 및 API 비동기 통신.

### 데이터 여정 (Data Journey)

| 변수명         | 발생 위치                    | 변화/가공 로직                                        | 참조/최종 목적지                           |
| :------------- | :--------------------------- | :---------------------------------------------------- | :----------------------------------------- |
| `diaryContent` | `CalendarTab.jsx` (useState) | 사용자의 `textarea` 입력에 의해 실시간 업데이트       | `saveDiaryThunk` 호출 시 Payload로 전달    |
| `diaryImages`  | `CalendarTab.jsx` (useState) | `handleImageUpload`를 통해 Base64 변환 후 배열에 추가 | `saveDiaryThunk` 호출 시 Payload로 전달    |
| `selectedDate` | Redux Store                  | `handleDateChange` 시 업데이트                        | `fetchDiaryThunk` 호출 시 날짜 필터로 사용 |

## 2. 세부 구현 계획

### A. 시각적 디자인 개선 (Aesthetics)

- **헤더**: `MdBook` 아이콘 주변에 부드러운 네온 글로우 효과 추가. "DAILY LIFE LOG" 글자 자간(tracking) 및 명암 대비 강화.
- **컨테이너**: `backdrop-blur-3xl`을 유지하되, `border-white/10` 대신 `linear-gradient` 테두리를 사용하여 고급스러운 느낌 부여.
- **Textarea**: 포커스 시 테두리에 `blue-500/30` 수준의 글로우 효과와 내부 배경색의 미세한 변화(transition) 적용.
- **이미지 갤러리**: 이미지가 없을 때의 가이드 텍스트를 더 세련되게 변경. 이미지 호버 시 삭제 버튼이 부드럽게 나타나도록 애니메이션 추가.

### B. 상호작용 및 애니메이션

- 입력창에 포커스가 올 때 전체 위젯의 테두리가 은은하게 빛나는 효과 (Ambient Glow).
- 버튼 클릭 시 `active:scale-95`와 같은 미세한 반동 효과 적용.
- 데이터 싱크 성공 시 토스트 메시지 외에도 UI 내 상태 표시기(`Synchronized`)에 애니메이션 적용.

## 3. 검증 계획

- [ ] 텍스트 입력 및 이미지 업로드 시 레이아웃 깨짐 현상 확인.
- [ ] 다양한 화면 해상도(반응형)에서 위젯의 비례 확인.
- [ ] 다크 모드 테마와의 조화 및 가독성 체크.

## 4. [주의] 영향도 분석

- `CalendarTab.jsx`의 다른 섹션(Calendar, Habits) 레이아웃에 영향을 주지 않도록 `flex` 속성 주의 깊게 조정.
- `CalendarView_v2.css` 수정 시 기존 캘린더 타일 스타일에 Side Effect가 없는지 확인.
