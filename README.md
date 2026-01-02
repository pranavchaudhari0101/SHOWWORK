# ShowWork 🚀

A modern portfolio platform for ambitious students. Built with Next.js 14, Tailwind CSS, and Supabase.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS (build-time) |
| Animations | Minimal GSAP |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Hosting | Vercel |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a [Supabase](https://supabase.com) project
2. Run the SQL from `database/schema.sql` in the SQL editor
3. Enable Google and GitHub auth providers

### 3. Configure environment

Copy `.env.example` to `.env.local` and add your credentials:

```bash
cp .env.example .env.local
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
vercel
```

## Project Structure

```
showwork/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── login/              # Auth pages
│   ├── register/
│   ├── explore/            # Browse projects
│   └── dashboard/          # User dashboard
├── lib/
│   └── supabase/           # Supabase clients
├── database/
│   └── schema.sql          # PostgreSQL schema
└── tailwind.config.js      # Tailwind theme
```

## Design

- **Theme**: Premium minimal black & white
- **Accents**: Subtle blue/green micro elements
- **Typography**: Inter font

## License

MIT
