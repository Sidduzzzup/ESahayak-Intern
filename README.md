Buyer Intake App (Next.js App Router)
====================================

This is a small, easy-to-read buyer lead intake application built with Next.js (App Router) and TypeScript. It covers the essentials you’d expect in a take‑home: a clean SSR list with real pagination and filters, accessible forms with validation, basic auth to assign an owner to each lead, CSV import/export, and a simple change history with an optimistic concurrency check on edits.

What’s inside
- Next.js 14 (App Router) with TypeScript
- Prisma ORM with SQLite locally (swap to Postgres in minutes)
- Zod validation on both client and server
- iron-session demo login (no external provider required)
- Simple, readable CSS (utility classes live in `app/globals.css`)

Quick start (Windows PowerShell)
1) Install dependencies
```powershell
npm install
```
2) Add a session secret to `.env.local`
```powershell
Set-Content .env.local 'IRON_PASSWORD="replace-with-a-strong-secret"'
```
3) Apply database migrations and start the dev server
```powershell
npx prisma migrate dev -n init
npm run dev
```
4) Log in and explore
- Visit `http://localhost:3000/login` to create a demo session.
- Go to `http://localhost:3000/buyers` for the list view.

Core pages and flows
- `/buyers` (SSR list):
	- Real pagination (10 per page), default sort by `updatedAt desc`.
	- URL-synced filters: `city`, `propertyType`, `status`, `timeline`.
	- Debounced search on `fullName | phone | email`.
	- Export current filtered results as CSV.
- `/buyers/new` (create):
	- Accessible form with client-side Zod validation.
	- On submit, server validates again and saves with the logged-in user as `ownerId`.
- `/buyers/[id]` (view/edit):
	- Shows details and an edit form.
	- Optimistic concurrency: update requires an unchanged `updatedAt`; if stale, you’ll get a clear conflict message.
	- Shows last 5 changes (timestamp + who changed).
	- Only the `ownerId` can edit or delete; anyone logged in can view.
- `/buyers/import` (CSV import):
	- Upload up to 200 rows.
	- Each row is validated; invalid rows are reported with clear error messages.
	- Valid rows insert in a single transaction.

Data model (Prisma)
- `buyers` table
	- `id (uuid)` – primary key
	- `fullName` – string
	- `email` – optional string
	- `phone` – string
	- `city` – enum: `Chandigarh | Mohali | Zirakpur | Panchkula | Other`
	- `propertyType` – enum: `Apartment | Villa | Plot | Office | Retail`
	- `bhk` – enum: `1 | 2 | 3 | 4 | Studio` (required if `Apartment` or `Villa`; optional otherwise)
	- `purpose` – enum: `Buy | Rent`
	- `budgetMin`, `budgetMax` – integers (`budgetMax ≥ budgetMin`)
	- `timeline` – enum: `0-3m | 3-6m | >6m | Exploring`
	- `source` – enum: `Website | Referral | Walk-in | Call | Other`
	- `status` – enum: `New | Qualified | Contacted | Visited | Negotiation | Converted | Dropped` (default `New`)
	- `notes` – optional text (≤ 1000 chars)
	- `tags` – string[] stored as JSON
	- `ownerId` – the current user’s id
	- `updatedAt` – timestamp for concurrency check and sorting
- `buyer_history` table
	- `id` – uuid
	- `buyerId` – fk to `buyers.id`
	- `changedBy` – user id
	- `changedAt` – timestamp (default now)
	- `diff` – JSON with the changed fields and before/after values

Validation rules (Zod)
- `fullName` length ≥ 2
- `phone` is 10–15 digits (`^[0-9]{10,15}$`)
- `email` is optional but must be valid when present
- `budgetMax ≥ budgetMin`
- `bhk` is required if `propertyType` is `Apartment` or `Villa`

CSV import/export
- Headers (must match exactly):
	- `fullName, email, phone, city, propertyType, bhk, purpose, budgetMin, budgetMax, timeline, source, status, notes, tags`
- Maximum rows: 200
- Unknown enum values cause a row-level error (e.g., invalid `city`, `status`, etc.)
- `tags` can be a comma-separated string (e.g., `hot, referral`) or a JSON array of strings
- Import UI is at `/buyers/import`. Export for the current filter set is available on `/buyers`.

Example CSV
```csv
fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,status,notes,tags
Alice Johnson,alice@example.com,9876543210,Mohali,Apartment,2,Buy,5000000,6500000,0-3m,Website,New,Prefers top floors,"hot,priority"
Bob Kumar,,9998887777,Zirakpur,Plot,,Buy,2000000,3500000,>6m,Referral,Qualified,,
```

Auth and permissions
- Demo login: go to `/login` and submit the form to create a session. The session user’s `id` becomes the `ownerId` for records you create.
- Visibility: anyone logged in can see all buyers.
- Editing: only the `ownerId` can edit or delete a buyer.
- Concurrency: updates require the client’s `updatedAt` to match the server’s. If it doesn’t, the API responds with HTTP 409 (Conflict) and the UI prompts you to refresh.

Switching to Postgres (optional)
1) Update Prisma provider and connection string
	 - In `prisma/schema.prisma`, set `datasource db { provider = "postgresql" ... }`.
	 - In `.env.local`, set `DATABASE_URL` to your Postgres connection string.
2) Recreate the database schema
```powershell
npx prisma migrate reset
# or generate a new migration
npx prisma migrate dev -n switch-to-postgres
```

Scripts
```powershell
# run dev server
npm run dev

# build and start production server
npm run build
npm start

# type checks are handled by Next; run unit tests
npm test

# lint
npm run lint
```

Project structure (high-level)
- `app/` – App Router pages, error boundary, and minimal layout/styles
- `app/buyers/` – list, new, detail, and import UIs
- `app/api/buyers/` – CRUD, import, export handlers
- `lib/` – Prisma client, auth/session helpers, Zod schemas, CSV utilities
- `prisma/` – schema and migrations
- `tests/` – a small unit test around validation utilities

Accessibility considerations
- All form fields have `<label>` elements and error messages are announced via `role="alert"`.
- Submit buttons use `aria-busy` during network requests.
- Empty states and errors are readable and focusable.

Troubleshooting
- “No session password provided”: ensure `.env.local` has a strong `IRON_PASSWORD` value.
- Migration issues:
	- Remove `prisma/dev.db` if needed and re-run `npx prisma migrate dev -n init`.
	- If switching databases, run `npx prisma migrate reset` first.
- Type errors related to forms: the app uses Zod + `react-hook-form`; if your editor shows type mismatches during dependency updates, a clean install (`rm -r node_modules` then `npm i`) usually fixes it.

License
This project is intended for take‑home demonstration purposes. Use, modify, and extend as you wish.
