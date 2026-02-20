# 📋 Task: V2 Evolution - Advanced Dashboard & Categories

## 0. Revision History & Milestone Status

**[Current Status: v3.6_20260220]**

### v3.0: Parallel Architecture Setup (260211)

- **Status**: [Completed] 100%
- **Content**: V1 레거시 코드를 보호하면서 `_v2` 파일군(`Home_v2`, `App_v2` 등)을 통한 병렬 트리 시스템 확립.
- **Troubles**: 동일한 Redux State를 공유할 때 발생하는 충돌 방지를 위해 슬라이스 네이밍 컨벤션 분리.

### v3.2: Category System & Extended Schema

- **Status**: [Completed] 100%
- **Content**: 카테고리 컬러 매칭, `tasks_v2` 테이블 내 시간 정밀도(`TIMESTAMP`) 확보.
- **Troubles**: 카테고리 삭제 시 해당 태스크들의 `categoryId`가 붕 뜨는 고아 데이터(Orphan) 이슈 해결 (`Set Null` 제약 적용).

### v3.5: Premium UX Integration

- **Status**: [Completed] 95%
- **Content**: `VersionLoader` 시네마틱 연출, `InitialSpaceLoader` 우주 인트로 시스템 결합.
- **Troubles**: 애니메이션 렌더링 시 브라우저 그래픽 가속(`GPU Acceleration`) 누락으로 인한 프레임 드랍 보정.

---

## 1. 상세 개발 및 검증 현황 (V2 파트 집중)

### [Architecture] Parallel Development System

- [x] **File Tree**: `front/src/components/v2/` 독립 디렉토리 체계 구축 완료.
- [x] **Redux**: `categorySlice` 및 `taskSliceV2` 개발 완료.
- [x] **Routing**: `/v2`, `/v2/calendar` 전용 경로 연동 완료.
- **[Verification Required]**: V1 홈에서 V2 홈으로 전환 시 브라우저 메모리 사용량이 급증하는 메모리 누수(Memory Leak) 현상 정밀 모니터링.

### [Module] Advanced Category System

- [x] **Backend**: `categoryControllers_v2.js` 연동 및 CRUD 완성.
- [x] **Frontend**: 카테고리별 커스텀 HEX 컬러 렌더링 파이프라인 구축.
- [x] **Interaction**: 태스크 등록 모달에서 카테고리 즉시 생성 기능 연동.
- **[Verification Required]**: 동일한 이름의 카테고리 중복 생성 시 서버 측 유효성 검사 및 에러 팝업 노출 여부 확인.

### [Module] Premium Calendar_v2

- [x] **Engine**: `react-calendar` 기반의 커스텀 타일 렌더링 엔진 고도화.
- [x] **Marker**: 카테고리 컬러가 반영된 데이터 점 표시(`Category Colored Dots`) 완료.
- [x] **UX**: 타일 클릭 시 당일 일정 요약 팝업 띄우기 기능 구현 완료.
- **[Verification Required]**: 한 날짜에 카테고리가 다른 일정이 5개 이상 존재할 때 닷(Dot)의 레이아웃이 균일하게 깨지지 않는지 체크.

### [Visuals] Cinematic Transition

- [x] **Loader**: `VersionLoader`의 Backdrop-blur 및 Opacity 애니메이션 완성.
- [x] **Cinematic**: `InitialSpaceLoader`의 우주 배경 파티클 시스템 연동 완료.
- **[Verification Required]**: 인터넷 속도가 느린 환경에서 로딩 애니메이션이 중간에 끊기지 않고 자연스럽게 다음 화면으로 전이되는지 지연(Latency) 테스트.

---

## 2. 작업 이력 및 현황 요약

- **V3.0 (260211)**: 인프라 분리 및 스키마 설계 단계.
- **V3.5 (260219)**: 시각적 임팩트(Visual Impact) 강화 및 프리미엄 UX 엔진 탑재 단계.
- **V3.6 (Current)**: 각 모듈 간 비즈니스 로직 정합성 최종 검증 단계.

---

## 3. 정밀 검증 시나리오 명세 (Testing Protocols)

1. **Scenario 1 [Category Cascade Delete]**: 카테고리 '업무' 삭제 -> '업무'로 분류되었던 할 일들이 '미분류'로 자동 전환되는지 확인.
2. **Scenario 2 [Complex View Transition]**: V1(Home) -> V2(Home) -> V2(Calendar) -> V1(Important) 순차 이동 시 레이아웃 깨짐 현상 전수 조사.
3. **Scenario 3 [High Precision Time]**: 마감 기한을 `23:59:59`로 설정 후 DB 저장 및 재조회 시 초 단위까지 정확히 일치하는지 확인.
