# ShowWork 🚀

A modern portfolio platform for ambitious students. Showcase your projects, connect with recruiters, and land your dream role.

![ShowWork](https://img.shields.io/badge/Next.js-14-black) ![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20DB%20%7C%20Storage-green) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue) ![Three.js](https://img.shields.io/badge/Three.js-WebGL-orange)

## 🌐 Live Demo

**[https://showhowwork.vercel.app](https://showhowwork.vercel.app)**

## ✨ Features

- **🔐 Authentication** - Email/Password & Google OAuth via Supabase Auth
- **📁 Project Uploads** - Share your work with images, tech stack, and links
- **🔍 Explore** - Browse and discover projects from other students
- **📊 Dashboard** - Manage your projects, analytics, and saved items
- **👤 Profile Settings** - Customize your public profile with bio and social links
- **🎨 Animated Background** - WebGL-powered Silk animation using Three.js
- **✨ Smooth Animations** - Staggered fade-up effects on page load

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Background | Three.js / React Three Fiber |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Hosting | Vercel |

## 📁 Project Structure

```
showwork/
├── app/
│   ├── layout.tsx              # Root layout with Silk background
│   ├── page.tsx                # Landing page
│   ├── login/                  # Sign in page
│   ├── register/               # Sign up page
│   ├── explore/                # Browse all projects
│   ├── categories/             # Browse by category
│   ├── trending/               # Trending projects
│   ├── upload/                 # Create new project
│   ├── project/[id]/           # Project detail page
│   ├── profile/[username]/     # Public profile page
│   └── dashboard/
│       ├── page.tsx            # Dashboard home
│       ├── projects/           # My projects
│       ├── analytics/          # Analytics (coming soon)
│       ├── saved/              # Saved projects
│       └── settings/           # Profile settings
├── components/
│   ├── Navbar.tsx              # Shared navigation bar
│   ├── Silk.tsx                # WebGL animated background
│   └── SilkBackground.tsx      # Silk wrapper component
├── lib/supabase/               # Supabase client configuration
├── database/
│   ├── schema.sql              # PostgreSQL schema
│   └── storage_setup.sql       # Storage bucket setup
└── tailwind.config.js          # Tailwind theme configuration
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pranavchaudhari0101/SHOWWORK.git
cd SHOWWORK
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a [Supabase](https://supabase.com) project
2. Run the SQL from `database/schema.sql` in the SQL editor
3. Run the SQL from `database/storage_setup.sql` to create storage bucket
4. Enable Email and Google auth providers in Authentication settings

### 4. Configure environment

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

```bash
vercel
```

## 🎨 Design System

- **Theme**: Premium minimal dark mode
- **Background**: Animated Silk WebGL effect (#1a191a)
- **Accents**: Subtle blue (#3b82f6) and green (#22c55e) micro elements
- **Typography**: Inter font family
- **Animations**: CSS fade-up with staggered delays

## 📄 License

MIT
