# 📘 AICC 8 Deploy App: The Complete Life-Management Ecosystem

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen) ![Version](https://img.shields.io/badge/Version-3.5.0-blue) ![License](https://img.shields.io/badge/License-MIT-orange) ![Node](https://img.shields.io/badge/Node-v18+-green) ![React](https://img.shields.io/badge/React-v19-61DAFB)

> **AICC 8 Deploy App**은 단순한 일정 관리를 넘어, 사용자의 파편화된 생산성 데이터(업무, 일기, 습관, 일정)를 하나의 프리미엄 생태계 안에서 관리하기 위해 설계된 **차세대 통합 매니지먼트 플랫폼**입니다.

---

## � Key Features Overview

### 🏁 Generation 1: Foundation (Essential Productivity)

- **Dynamic Task Management**: 업무의 중요도와 마감 기한에 따른 실시간 필터링 시스템.
- **Fluid Grid Layout**: 해상도에 따라 1/2/3열로 자동 전환되는 적응형 그리드 엔진.
- **Smart Sidebar**: Mini/Full 모드를 지원하며 실시간 검색 기능이 통합된 하이브리드 내비게이션.

### � Generation 2: Premium Evolution (Enhanced Experience)

- **Visual Innovation**: Backdrop-blur와 Radial Glow를 결합한 **울트라 글래스모피즘(Glassmorphism)** 디자인.
- **Cinematic Transitions**: V1과 V2를 오갈 때의 시네마틱 로딩(`VersionLoader`) 및 우주 배경의 인트로 연출.
- **Category Matrix**: 커스텀 컬러 매칭이 가능한 카테고리 시스템과 이를 연동한 컬러 닷(Dot) 캘린더.

### 🏠 Private Space: Life-Log Hub (Personal Identity)

- **Hero Dashboard**: 캘린더와 다이어리를 수평/수직으로 결합한 몰입형 다이어리 시스템.
- **Neural Protocol Tracker**: 사용자의 반복적인 습관 성취도를 시각화하고 로그를 기록하는 습관 엔진.
- **Event Horizon**: 이미지 첨부, 장소 기록, 기념일 분기 처리가 포함된 복합 스케줄링 모듈.

---

## 🏗️ Technical Architecture & Design Decisions

### 1. Parallel Development Architecture (세대 격리 전략)

- **Problem**: 신규 기능 도입 시 기존 V1 사용자의 환경을 해치지 않아야 함.
- **Solution**: 모든 V2 컴포넌트와 라우트를 별도 디렉토리(`front/src/components/v2/`) 및 경로(`/v2/*`)로 운영하여 세대 간 간섭을 완벽히 차단했습니다.

### 2. Data Isolation & Security (데이터 격리)

- **Isolation**: Google OAuth `sub` 값을 유니크 키로 사용하여, DB 쿼리 레벨에서 사용자 데이터를 물리적으로 격리합니다.
- **Traceability**: 모든 업무 상태 변경 시 전후 데이터를 기록하는 감사 로그(Audit History) 기능을 탑재했습니다.

### 3. Vertical Space Optimization (레이아웃 정밀 튜닝)

- **Vertical Compression**: 1080p 해상도에서 6주차 달력이 짤리는 문제를 해결하기 위해 헤더 폰트 스케일링(`text-25px`)과 그리드 행 높이(`78px`)를 수학적으로 계산하여 최적화했습니다.

---

## �️ Technology Stack

| 분류         | 기술 (Technology)        | 설명                                           |
| :----------- | :----------------------- | :--------------------------------------------- |
| **Frontend** | React 19, Redux Toolkit  | 전역 상태 관리 및 선언적 UI 구성               |
| **Backend**  | Node.js, Express         | RESTful API 서버 및 비즈니스 로직 처리         |
| **Database** | PostgreSQL               | 관계형 데이터 모델링 및 JSONB 복합 데이터 저장 |
| **Auth**     | Google OAuth 2.0         | JWT 기반의 안전한 사용자 인증 체계             |
| **Styling**  | Vanilla CSS, TailwindCSS | 프리미엄 디자인 시스템 및 유연한 레이아웃      |

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- PostgreSQL (v14.0 or higher)

### Environment Variables (.env)

서버 구동을 위해 `back/.env` 파일에 다음 정보가 필요합니다.

```env
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
GOOGLE_CLIENT_ID=your_google_client_id
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/aicc8_deploy_app.git

# Backend Setup
cd back
npm install
npm start

# Frontend Setup
cd front
npm install
npm run dev
```

---

## 📄 Documentation Guide

더 상세한 정보는 아래의 기술 문서들을 참조하십시오.

- [**API 명세서 (Standard)**](./api_spec.md): 전 영역 엔드포인트 및 연동 가이드.
- [**시스템 아키텍처 (Master)**](./ARCHITECTURE_V2_Private.md): 파일 의존성 및 데이터 흐름 상세 명세.
- [**프로젝트 성과 보고서**](./PROJECT_REPORT.md): 기술적 난관 및 트러블슈팅 이력.
