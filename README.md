<div align="center">

# 물가체크 (MulgaCheck)
**데이터 기반 실시간 해외여행 일정 및 예산 자동 생성 서비스**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)](https://aistudio.google.com/)

[웹사이트 바로가기](https://www.mulgacheck.com/) 

</div>

## 프로젝트 소개 (Overview)
기존의 여행 정보 블로그나 카페 글들은 작성된 지 오래되어 현재의 물가와 환율을 제대로 반영하지 못하는 경우가 많았습니다. 또한, 단순 챗봇에게 여행 일정을 물어보면 실존하지 않는 식당을 추천하거나 예산을 터무니없이 적게 잡는 등 '할루시네이션(환각)' 현상과 '최신 데이터 부족'이라는 명확한 한계가 존재했습니다.

물가체크(MulgaCheck)는 이러한 문제를 해결하기 위해 기획된 B2C 서비스입니다. 
구글의 Gemini 2.5 Flash와 Google Search Grounding(검색 연동) 기술을 결합하여, 사용자가 입력한 예산(원화)을 실시간 현지 환율로 변환하고 현재 영업 중인 실제 장소들의 물가를 반영한 100% 현실적인 여행 일정을 생성합니다.

또한, 구글 검색 엔진 상단 노출을 목표로 프로그래매틱 SEO(Programmatic SEO) 전략을 도입했습니다. 사용자가 생성한 양질의 여행 일정 데이터를 동적 웹페이지로 자동 변환하고 사이트맵에 즉각 반영되도록 설계하여, 개발자가 직접 글을 쓰지 않아도 오가닉 트래픽을 창출할 수 있는 자동화된 아키텍처를 구축했습니다.

## 핵심 기능 (Key Features)
* **AI 맞춤형 여행 일정 생성:** 여행지, 기간, 동행자, 스타일, 예산을 입력하면 AI가 실시간 검색을 통해 동선이 최적화된 상세 일정과 예상 경비를 JSON 형태로 반환하여 시각적인 UI로 제공합니다.
* **실시간 환율 및 물가 반영 로직:** 사용자가 '150만원'을 입력하면 AI가 자체적으로 현지 화폐로 환전 비율을 계산하고, 해당 예산의 90~100%를 알맞게 소진할 수 있도록 지능형 프롬프트 엔지니어링이 적용되어 있습니다.
* **여행 준비물 체크리스트:** 다양한 기본적인 준비물을 체크하고 이미지로 저장하고, 개인적으로 추가하고 싶은 물품을 추가해서 링크로 공유하거나 이미지로 저장해서 공유할 수 있는 기능을 제공합니다.
* **여행 성향 MBIT 테스트:** 16종류의 MBTI를 바탕으로 10가지정도의 질문을 바탕으로 16개의 여행성향을 제작해 테스트해보고 공유할 수 있는 기능을 제공합니다.
* **여행자 라운지 (커뮤니티):** 사용자가 생성한 일정을 익명으로 커뮤니티에 공개하여 다른 사람들과 공유할 수 있으며, 클릭 한 번으로 일정을 텍스트로 복사하거나 카카오톡 등으로 공유할 수 있습니다.
* **프로그래매틱 SEO 및 동적 렌더링:** 커뮤니티에 공유된 수많은 일정들은 Next.js의 동적 라우팅(`[id]/page.tsx`)과 SSR을 통해 각각 고유한 메타데이터(Title, Description)를 가진 독립적인 페이지로 생성되어 검색 엔진에 자동 색인됩니다.
* **강력한 보안 및 Rate Limit:** 무분별한 API 호출에 따른 비용 폭탄을 막기 위해 Cloudflare Turnstile을 이용한 봇 차단과, Supabase 기반의 IP당 일일 생성 횟수 제한(3회) 시스템을 구현했습니다.
* **부분 일정 재생성 (Regenerate):** 마음에 들지 않는 특정 날짜의 일정만 선택하여 "저녁을 오마카세로 바꿔줘"와 같은 추가 프롬프트를 통해 해당 일자만 다시 생성하는 세밀한 수정 기능을 제공합니다.

## 기술 스택 및 도입 배경
* **프론트엔드 (Next.js 14 App Router, React, TypeScript)**
  * SEO 최적화와 동적 메타데이터 생성이 필수적인 서비스 특성상, SSR(서버 사이드 렌더링)을 완벽하게 지원하는 Next.js App Router를 채택했습니다.
* **스타일링 (Tailwind CSS, Lucide React)**
  * 직관적이고 깔끔한 UI를 빠르게 구현하고, 컴포넌트 레벨에서의 스타일 충돌을 방지하기 위해 Tailwind CSS를 도입했습니다.
* **백엔드/BaaS (Supabase)**
  * 사용자가 생성한 일정 데이터(`community_plans`)와 API 호출 로그(`api_logs`)를 관계형 데이터베이스(PostgreSQL)에 안정적으로 저장하고, 관리자 권한(Service Role)을 통한 안전한 데이터 제어를 위해 사용했습니다.
* **AI & API (Gemini 2.5 Flash, Cloudflare Turnstile)**
  * 빠르고 저렴하면서도 Google Search 기능을 네이티브하게 지원하여 최신 물가와 환율 정보를 가져올 수 있는 Gemini 2.5 Flash 모델을 채택했습니다.

## 트러블 슈팅 및 UX 최적화 (Troubleshooting)

### 1. AI 예산 오차 및 환율 미적용 문제 극복
* **문제 상황:** 사용자가 원화로 예산(예: 150만 원)을 입력했을 때, 뉴질랜드 달러나 유로 등 현지 화폐에 대한 AI의 이해도가 떨어져 환율 변환 과정에서 심각한 오차가 발생했습니다. 또한 AI가 예산을 지나치게 아끼려는 경향이 있어 설정한 예산에 크게 못 미치는 결과(예: 89만 원)를 출력했습니다.
* **해결 방안:** 프롬프트를 전면 개편했습니다. 1단계로 Google Search를 통해 한국 원화와 현지 화폐의 실시간 환율을 강제로 검색하게 하고, 2단계로 변환된 현지 예산의 90~100%를 무조건 소진하도록 지시(Instruction)를 강화했습니다. 또한 클라이언트 단에서 '150'을 '150만원'으로 자동 파싱하여 AI의 숫자 인지 오류를 방지했습니다.

### 2. 무분별한 API 호출 방지를 위한 Rate Limit 및 에러 핸들링
* **문제 상황:** IP 기반 일일 3회 제한 로직이 정상 작동하지 않아 무한 생성이 가능하거나 엉뚱한 시점에 차단되는 오류가 있었습니다. RLS(Row Level Security) 정책 충돌 및 DB 조회 실패 시의 예외 처리가 미흡했습니다.
* **해결 방안:** 
  1. `supabase-admin.ts`를 별도로 구성하여 `SUPABASE_SERVICE_ROLE_KEY`를 통해 관리자 권한으로 `api_logs` 테이블에 접근하도록 수정하여 권한 문제를 해결했습니다.
  2. SQL 쿼리로 명확하게 조회(`count`) 기준을 잡고, 만약 DB 에러가 발생하더라도 사용자 경험을 해치지 않기 위해 일단 `allowed: true`로 통과시키되 백그라운드에 로그를 남기는 유연한 에러 핸들링을 적용했습니다.
  3. 프론트엔드 단에 일일 제한 초과 시 명확한 안내 문구와 직관적인 에러 UI를 구현하여 사용자 이탈을 방지했습니다.
