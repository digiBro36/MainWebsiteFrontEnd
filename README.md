# Digital Marketing Agency Frontend (Next.js + Tailwind)

This project is a premium frontend for the **Digital Marketing Agency** backend (Spring Boot + MongoDB + JWT). It includes a fully featured marketing site plus a protected admin portal.

## 🚀 Features

- **Modern dark theme with glassmorphism**
- **Next.js 14 App Router** (server + client components)
- **TypeScript strict mode** (no `any`)
- **Tailwind CSS / Tailwind Merge / clsx**
- **Framer Motion animations** (page transitions, hover, scroll reveal)
- **React Query (TanStack)** for API caching
- **Zustand** for auth state management
- **React Hook Form + Zod** for validated forms
- **Axios with JWT interceptor**
- **Recharts analytics charts**
- **Fully responsive**, accessible, performance-first layout

---

## 🧭 Folder Structure

```
frontend/
  app/                 # Next.js App Router (pages)
    admin/             # Admin dashboard routes
    contact/
    portfolio/
    services/
    page.tsx           # Landing page
    layout.tsx         # Root providers
  components/          # UI components & sections
    admin/             # Admin dashboard widgets
    marketing/         # Public marketing page sections
    ui/                # Atomic UI primitives
  hooks/               # Data hooks (React Query)
  lib/                 # Helpers, API client, utils
  stores/              # Zustand stores
  types/               # Shared TypeScript types
  public/              # Static assets / images
  tailwind.config.ts
  next.config.js
  package.json
```

---

## 🧩 Environment Variables

Create a `.env.local` file at `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Digital Marketing Agency
```

---

## 🏁 Getting Started

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`.

---

## 🧠 Backend Integration

This frontend assumes the backend running at `NEXT_PUBLIC_API_URL` and uses JWT for authentication.

### Auth flow

1. Admin logs in via `/admin/login`
2. API returns JWT token
3. Token stored in localStorage
4. Token is attached to protected API requests

### Protected APIs

- `GET /leads` (admin)
- `DELETE /leads/{id}` (admin)
- `POST /services`, `PUT /services/{id}`, `DELETE /services/{id}` (admin)
- `POST /projects`, `PUT /projects/{id}`, `DELETE /projects/{id}` (admin)

---

## 🎨 Design System

- Primary: **#6366f1**
- Secondary: **#f59e0b**
- Background: **#0f172a**
- Glass effect: `bg-white/5`, `backdrop-blur-xl`, border white/10

Animations and UI components follow a consistent theme for premium polish.

---

## 🧪 Next Steps / Enhancements

- Add CMS for managing testimonials
- Add real lead scoring UI
- Improve admin auth with refresh tokens
- Enhance analytics with real data charts
- Add PWA support

---

## 🛠 Useful Commands

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - lint code
