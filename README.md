# CROCS KOREA 쇼핑몰 리뉴얼

크록스 코리아 공식 온라인 스토어의 사용자 경험과 화면 구성을 개선하기 위해 제작한 React 기반 쇼핑몰 리뉴얼 프로젝트입니다. 브랜드의 경쾌한 이미지를 살린 UI와 상품 탐색부터 주문까지 이어지는 주요 쇼핑 흐름을 구현했습니다.

## Project Overview

기존 사이트를 분석하고 쇼핑몰의 주요 화면과 사용자 흐름을 새롭게 구성했습니다. 프로젝트 기획 당시 문제로 정리한 내용은 복잡한 구매 동선과 브랜드 이미지가 충분히 드러나지 않는 UI였습니다. 이에 메인 콘텐츠와 상품 중심의 화면을 재구성하고, 탐색·장바구니·회원 기능을 연결하는 것을 목표로 삼았습니다.

## Project Goals

- 브랜드의 컬러와 제품 비주얼을 중심으로 UI 개선
- 메인에서 카테고리와 프로모션, 브랜드 콘텐츠로 이어지는 탐색 경험 구성
- 카테고리·검색·사이즈·색상 필터를 통한 상품 탐색 지원
- 상품 상세, 장바구니, 회원 기능을 연결해 쇼핑 흐름 구현
- Firebase 인증과 사용자 데이터 연동, Zustand 기반 화면 상태 관리

## Project Info

| 항목 | 내용 |
| --- | --- |
| 진행 기간 | 2025.10.20 – 2025.12.01 (6주) |
| 프로젝트 형태 | 팀 프로젝트 |
| 확인 가능한 담당 업무 | UI 리디자인 및 퍼블리싱, React 컴포넌트 설계, Zustand 상태 관리, Firebase Auth / Firestore 연동 |
| 담당 페이지 | 메인, 상품 목록·상세, 회원 및 쇼핑 기능을 포함한 페이지 구현에 참여 |

저장소 파일에서 팀원 수와 팀장으로서 담당한 세부 업무 분담은 확인되지 않아 임의로 기재하지 않았습니다. 해당 정보를 알면 프로젝트 정보 표에 구체적으로 보완할 수 있습니다.

## Tech Stack

| 구분 | 기술 |
| --- | --- |
| Frontend | React 19, JavaScript, React Router |
| Styling | SCSS / Sass, CSS |
| State Management | Zustand, Zustand Persist |
| Backend / Data | Firebase Authentication, Cloud Firestore, Firebase Storage |
| UI | Swiper |
| Build | CRACO, Create React App |
| Design / Collaboration | Figma, Photoshop, Git, GitHub, Notion |

## Main Features

### 메인 페이지

`src/pages/Main.jsx`에서 풀페이지 스크롤 레이아웃을 구성하고 아래 콘텐츠를 섹션으로 연결합니다.

- 메인 비주얼 슬라이더
- 카테고리 바로가기
- 비주얼 슬라이드 섹션
- 지비츠·콜라보 상품 슬라이드
- 크록스 콘텐츠, 월간 콘텐츠, Instagram 영상
- 푸터 및 고객센터 모달
- COME AS 팝업과 닫은 상태 저장

### 상품 목록 및 상세

- 상품 데이터와 카테고리 데이터를 기반으로 상품 카드 렌더링
- 카테고리 및 하위 카테고리 탐색
- 검색어, 사이즈, 색상 필터와 페이지 이동
- 최근 본 상품 기록
- 일반 상품과 지비츠 상품의 목록·상세 화면 제공

상품 목록은 `useCrocsProductStore`에서 상품 데이터를 불러오고, 페이지에서 경로·검색어·카테고리·사이즈 등을 조합해 필터링합니다. 상품 원본 데이터는 `src/data/`에 포함되어 있습니다.

### 회원 인증 및 사용자 정보

- Firebase Authentication 이메일/비밀번호 회원가입 및 로그인
- Google 로그인 연동
- Firestore `users` 컬렉션에 사용자 프로필과 쿠폰 정보 저장
- Firebase 인증 상태를 구독해 세션 복원 및 로그인 상태 관리
- 마이페이지에서 사용자 정보 조회 및 수정

### 장바구니·위시리스트·주문

- 장바구니 상품 추가, 수량 변경, 선택 및 삭제
- 위시리스트, 최근 본 상품, 쿠폰 및 주문 내역 화면
- Zustand의 `persist` 미들웨어로 장바구니·위시리스트 등 일부 상태를 브라우저 저장소에 유지
- 회원 주문 데이터는 Firestore 사용자 문서와 연결하며, 비회원 주문은 `nonmemberOrders` 컬렉션에 기록

장바구니 상태 저장은 Firestore가 아니라 브라우저 저장소 기반입니다. Firebase는 인증, 사용자 정보, 회원 주문 등 코드에서 확인되는 데이터 연동에 사용합니다. 실제 결제 대행 연동은 저장소에서 확인되지 않습니다.

## Development

### 컴포넌트 구조

페이지 단위 화면은 `src/pages/`, 헤더·상품 카드·슬라이더·장바구니 등 재사용 UI는 `src/components/`에 배치했습니다. 데이터는 `src/data/`, 전역 상태는 `src/store/`, Firebase 초기화는 `src/firebase/`에서 관리합니다.

### 상태 관리

Zustand를 사용해 장바구니, 위시리스트, 최근 본 상품, 상품 목록 및 필터 상태를 기능별 스토어로 나눴습니다. `persist`를 적용한 스토어는 새로고침 후에도 브라우저 저장소에서 상태를 복원합니다.

### Firebase 연동

`src/firebase/firebase.js`에서 환경 변수로 Firebase 앱을 초기화하고 Authentication, Firestore, Storage 인스턴스를 제공합니다. 회원가입 시 Authentication 계정을 생성한 뒤 UID를 문서 ID로 하여 Firestore `users` 컬렉션에 프로필을 저장합니다. 로그인과 마이페이지에서는 해당 사용자 문서를 조회·갱신합니다.

## Collaboration

기존 프로젝트 문서에서 확인 가능한 협업 도구는 Git, GitHub, Notion입니다. 저장소에는 `origin`과 `upstream` Git 원격 저장소가 설정되어 있습니다.

팀별 업무 분담, 브랜치 네이밍 규칙, 코드 리뷰 및 병합 절차는 프로젝트 파일만으로 확인할 수 없어 구체적인 과정은 추가 정보가 필요합니다.

## Troubleshooting

현재 저장소의 코드와 문서에서 특정 이슈의 발생 원인, 해결 과정, 팀 내 병합 문제의 사례를 확인할 수 없어 해결 사례를 임의로 만들지 않았습니다. 프로젝트 진행 중 겪은 문제와 해결 과정을 추가하면 아래 형식으로 정리할 수 있습니다.

| 문제 | 원인 | 해결 방법 | 결과 |
| --- | --- | --- | --- |
| 실제 사례를 추가해 주세요 |  |  |  |

## Retrospective

팀장으로서의 경험과 프로젝트 회고는 저장소에 기록되어 있지 않습니다. 역할 조율, 일정 관리, 기술적으로 배운 점과 다음 프로젝트에서 개선할 점을 추가해 주세요.

## Links

- **GitHub Repository:** [limchaea/crocs_korea_renewal](https://github.com/limchaea/crocs_korea_renewal)
- **배포 URL:** 저장소에서 확인되지 않음
- **디자인 시안:** 저장소에서 확인되지 않음

## 실행 방법

### 요구 사항

- Node.js 및 npm
- Firebase 프로젝트 설정값 (Firebase 기능을 사용할 경우)

### 설치 및 실행

```bash
git clone https://github.com/limchaea/crocs_korea_renewal.git
cd crocs_korea_renewal
npm install
npm start
```

### Firebase 환경 변수

프로젝트 루트에 `.env` 파일을 만들고 Firebase 웹 앱의 설정값을 입력합니다. 환경 변수 파일은 `.gitignore`에 포함되어 있으므로 저장소에 커밋하지 마세요.

```env
REACT_APP_FIREBASE_API_KEY=발급받은_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=프로젝트_ID.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=프로젝트_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=프로젝트_ID.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=발급받은_SENDER_ID
REACT_APP_FIREBASE_APP_ID=발급받은_APP_ID
```

Firebase 콘솔에서 사용할 로그인 제공자와 Firestore·Storage를 설정해야 합니다.

### 명령어

```bash
npm start     # 개발 서버 실행
npm run build # 배포용 빌드 생성
npm test      # 테스트 실행
```

## Project Structure

```text
src/
├── assets/       # 아이콘 및 이미지 에셋
├── components/   # 재사용 UI 컴포넌트
├── data/         # 상품·카테고리·프로모션 데이터
├── firebase/     # Firebase 초기화 및 서비스 설정
├── pages/        # 라우트별 페이지
├── store/        # Zustand 상태 저장소
└── utils/        # 상품·카테고리 처리 유틸리티
public/           # 정적 이미지, 동영상 및 앱 리소스
```

## 첨부하면 좋은 자료

저장소에는 메인 비주얼·상품 이미지·프로모션 영상 등 정적 에셋이 포함되어 있습니다. README에 프로젝트 화면을 더 잘 보여주려면 다음 자료를 `docs/` 또는 `public/`에 추가하고 이미지 링크를 연결해 주세요.

- 리뉴얼 전·후 비교 이미지
- 메인 페이지 전체 및 상품 목록 페이지 캡처
- 로그인·장바구니 사용 흐름 GIF
- Figma 시안 또는 프로젝트 시연 영상
