![logo]](/public/logo.png)

# Quiet Hours Scheduler 🛎️🌙

A beautiful Next.js app for managing quiet hours — built with Supabase Auth, MongoDB, and scheduled cron notifications. Define quiet-hour blocks with automatic overlap prevention and get timely email reminders. Secure access is enforced with Row-Level Security (RLS).

---

## ✨ Highlights

- 🔐 User Authentication — Supabase Auth
- 🕒 Quiet Hour Management — create, update, delete blocks
- 🚫 Overlap Prevention — automatic conflict handling
- ✉️ Email Reminders — cron-triggered notifications
- 🛡️ Secure Data Access — Row-Level Security (RLS)
- ⚡ Optimized Fonts — Geist with next/font for faster loading

---

## 🧭 Getting Started

### Screenshots

![Welcome Page](/public/welcomepage.png)  
_Welcome screen and onboarding._

![Auth Page](/public/authpage.png)  
_Sign-in / sign-up flow powered by Supabase._

![Dashboard Email](/public/dashboard.png)  
_Dashboard view / ._

![mail](/public/mail.png)

### Prerequisites

- Node.js v18+
- npm / yarn / pnpm / bun
- Supabase project credentials

### Install

Clone the repository:

```bash
git clone https://github.com/prakhaaar/quiethours
cd quiet-hours
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Run the dev server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 and start editing `app/page.tsx` — changes auto-refresh 🔁

---

## ⚙️ Environment Variables

Create a `.env.local` in the project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_database_url

RESEND_API_KEY=your_resend_email_api_key
```

---

## 📚 Learn More

- Next.js Documentation — comprehensive guides and API refs
- Learn Next.js — interactive tutorials
- Supabase Docs — auth, database, and RLS setup
- MongoDB Docs — queries and indexing
- Next.js Deployment — deploy to Vercel

(Links can be added in your README to the official docs for each.)

---

## 🚀 Deployment (Vercel)

1. Connect your GitHub repo to Vercel
2. Set the environment variables in the Vercel dashboard
3. Click Deploy — your app will be live in minutes ✨

---

## 📁 Project Structure

```
/app             # Next.js App Router pages
/components      # Reusable React components
/lib             # Supabase and MongoDB helpers
/functions       # Serverless functions (cron jobs, notifications)
styles           # CSS / Tailwind styling
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open a PR or an issue — help improve the app 💖

---

## 🧾 License

This project is licensed under the MIT License.

Happy coding! 🚀
