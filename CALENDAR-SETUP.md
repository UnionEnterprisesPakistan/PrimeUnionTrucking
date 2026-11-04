# Prime Union Trucking — booking calendar setup

This version keeps the original three customer cards and their pages. The new custom calendar appears **only** on `/owner-operator` and `/getting-started`; the Fleet page continues using its lead form.

## What is implemented

- Screenshot-style date strip (next 14 US Eastern dates), live time-slot lookup, selectable time pills, first name/phone/email form, confirmed booking state, and UTM/referrer capture.
- `/api/availability` and `/api/book` work locally under Express and as Vercel Functions.
- Double-booking is prevented by a PostgreSQL unique constraint. All appointments share one booking inventory across the two pages.
- NY daylight-saving-time conversion handled with `America/New_York`.
- The existing original page copy, original 3 customer cards, other frontend animation logic, and fleet form are preserved.

## Important before going live

A calendar must not show fictional appointment availability. Without `DATABASE_URL`, `BOOKING_DAYS` and `BOOKING_TIMES`, it displays **“Booking schedule is not connected yet”** and the message form remains accessible. You must enter only real, staff-approved appointment days/times.

This implements availability only for this website's bookings. It does **not** automatically synchronize with the team’s Google/Outlook calendar or send email/calendar invitations. If your staff also books meetings elsewhere, integrate a calendar provider before accepting customer bookings to prevent conflicts. Customers' confirmations currently display on the website, and bookings are stored in PostgreSQL. Add notifications/invitations before public use.

## Apply the ZIP using PowerShell

**Recommended:** Save/backup the current project folder first. Extract the complete ZIP to a new folder. The included `public` directory is the original design with only the calendar component and scoped CSS updated. Do not copy `node_modules` or `.env` from untrusted sources.

Run from the extracted project folder:

```powershell
npm install
Copy-Item .env.example .env   # only if the .env file does not exist
npm run dev
```

### Set up PostgreSQL on Vercel

1. Create a hosted PostgreSQL database (e.g. Neon), obtain its **server connection string** and keep it secret.
2. `vercel link` if the new folder isn't linked already. Choose existing `uep4/prime-union-trucking`.
3. Add secrets to Vercel, one command at a time:

```powershell
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add BOOKING_DAYS production
vercel env add BOOKING_DAYS preview
vercel env add BOOKING_TIMES production
vercel env add BOOKING_TIMES preview
```

Values for `BOOKING_DAYS`: comma-separated weekday numbers `0=Sunday, 1=Monday, ... 6=Saturday`. Values for `BOOKING_TIMES`: comma-separated 24-hour **Eastern Time** (e.g. `17:00,17:30,18:00`). These are *format examples only*, not actual availability. Enter your team's approved schedule. The slot list is shared by both booking pages; times become unavailable automatically when booked.

4. Deploy after environment variables are set:

```powershell
vercel --prod
```

5. Verify the calendar pages and API:

```powershell
$site='https://YOUR_ACTUAL_VERCEL_PRODUCTION_URL'
Invoke-RestMethod "$site/api/availability?date=2026-11-05"
```

Replace with a future date in the configured schedule. Check that `configured` is `true` and slots are actually approved.

### GitHub

```powershell
git add public/assets/app.js public/assets/calendar.js public/assets/styles.css public/owner-operator.html public/getting-started.html api server.js package.json vercel.json .env.example .gitignore CALENDAR-SETUP.md
git commit -m "Add Eastern Time booking calendar and Vercel booking API"
git push origin main
```

**CAUTION:** Existing `/api/lead` Express handler still needs its own Vercel serverless/PostgreSQL migration for contact-form submissions. Do not treat those forms as live until tested; this calendar change does not resolve that separate issue.
