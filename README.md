Quiet Hours Scheduler

A Next.js project for managing quiet hours, built with Supabase Auth, MongoDB, and scheduled cron notifications. Users can define quiet hour blocks with automatic overlap prevention, while cron jobs trigger email reminders. Security is enforced using Row-Level Security for reliable and secure operations.

Features

User Authentication: Powered by Supabase Auth.

Quiet Hour Management: Create, update, and delete quiet hour blocks.

Overlap Prevention: Prevents scheduling conflicts automatically.

Email Reminders: Cron jobs send timely notifications to users.

Secure Data Access: Row-Level Security ensures users can only access their own data.

Optimized Font Loading: Uses Geist font with next/font for faster performance.

Getting Started
Prerequisites

Node.js (v18+ recommended)

npm / yarn / pnpm / bun

Supabase project credentials

MongoDB connection URL

Installation

Clone the repository:

git clone https://github.com/prakhaaar/quiethours
cd quiet-hours


Install dependencies:

npm install
# or
yarn install
# or
pnpm install
# or
bun install

Run Development Server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


Open http://localhost:3000
 in your browser.
Start editing the page by modifying app/page.tsx; changes auto-refresh.

Environment Variables

Create a .env.local file in the root and set the following:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
MONGODB_URI=your_mongodb_connection_uri
CRON_SECRET=your_cron_secret_key
RESEND_API_KEY=your_resend_email_api_key

Learn More

Next.js Documentation
 - comprehensive Next.js guides and API references.

Learn Next.js
 - interactive tutorials to get started.

Supabase Docs
 - authentication, database, and RLS setup.

MongoDB Docs
 - database queries and indexing.

Next.js Deployment
 - deploying to Vercel.

Deployment

The easiest way to deploy is on Vercel:

Connect your GitHub repository to Vercel.

Set environment variables in Vercel dashboard.

Click Deploy.

Your app will be live in minutes.

Project Structure
/app             # Next.js App Router pages
/components      # Reusable React components
/lib             # Supabase and MongoDB helpers
/functions       # Supabase serverless functions (cron jobs, notifications)
/styles          # CSS / Tailwind styling

Contributing

Contributions, issues, and feature requests are welcome!
Feel free to submit a PR or open an issue for improvements.

License

This project is licensed under the MIT License.
