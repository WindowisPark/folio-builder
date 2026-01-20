# My-Folio Builder

개발자/디자이너를 위한 포트폴리오 빌더. 프로젝트 쇼케이스, 이력서 관리, 커뮤니티 기능을 제공합니다.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, Framer Motion |
| UI | Shadcn/ui, Radix UI |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (SSR) |
| Form | React Hook Form + Zod |
| Drag & Drop | dnd-kit |

## Features

### Portfolio Editor (`/editor`)
- 프로필 관리 (이름, 소셜 링크, 스킬 태그)
- 프로젝트 CRUD + 이미지 크롭 + 드래그 정렬
- Case Study 작성 (challenges, solutions, troubleshooting)

### Resume Editor (`/editor/resume`)
- 경력, 학력, 수상, 자격증, 어학 관리
- 섹션별 드래그 정렬
- A4 PDF 출력 최적화

### Public Portfolio (`/[username]`)
- 반응형 포트폴리오 페이지
- 프로젝트 케이스 스터디 상세 페이지
- 인쇄/PDF 내보내기

### Community (`/community`)
- 친구 요청/수락/거절
- 포트폴리오 공개 범위 설정 (public/friends_only/private)

## Project Structure

```
app/
├── auth/           # OAuth callback, signout
├── login/, signup/ # 인증 페이지
├── editor/         # 보호된 에디터 (middleware)
│   ├── projects/   # 프로젝트 관리
│   └── resume/     # 이력서 관리
├── community/      # 커뮤니티 기능
└── [username]/     # 동적 포트폴리오 라우트
    ├── project/[id]/ # 케이스 스터디
    └── resume/       # 이력서 공개 페이지

components/
├── ui/             # Shadcn 컴포넌트
├── portfolio/      # 포트폴리오 뷰 컴포넌트
└── resume/         # 이력서 뷰 컴포넌트

lib/supabase/       # Supabase client (server/client)
supabase/           # DB 스키마 & 마이그레이션
```

## Database Schema

```
profiles ──┬── portfolios ──── portfolio_projects ───┐
           │                                         │
           ├── projects ─────────────────────────────┘
           │
           ├── work_experiences
           ├── educations
           ├── awards
           ├── certifications
           └── language_certs

friendships (requester_id ↔ receiver_id)
```

**RLS 정책:** Public read, Owner write/delete

## Getting Started

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 설정

# 개발 서버 실행
npm run dev
```

## Vercel 배포

1. [Vercel](https://vercel.com)에서 GitHub 레포 연결
2. Environment Variables 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

**Hobby(무료) 플랜 포함:**
- 무제한 배포
- 자동 HTTPS
- 커스텀 도메인 1개
- 월 100GB 대역폭
- Serverless Function 실행 (100GB-hrs/월)

## License

MIT
