# The Longer Road — Visual Design Trial

This trial preserves all approved website copy, existing frontend routes, original three audience cards, lead forms, calendar JavaScript, Express backend, and Vercel configuration from the prior project.

The redesign is an original native CSS design informed by Watermelon UI’s component interaction approach; it does **not** contain installed Watermelon React components.

Palette: obsidian #101c21, porcelain #f6f3eb, sage #dce6dd, volt lime #d5ff65.

Changes: new `public/assets/longer-road.css` loaded by all four HTML pages. Existing scripts and APIs are untouched.

**Please review before production.** Calendar needs actual database credentials and booking availability configuration; visual redesign is not proof of successful production bookings.

## Local run

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

## Existing project / redesign branch

You may copy just `public/assets/longer-road.css` and the four HTML pages into your `corporate-redesign` branch. Do not modify or deploy `main` until review.
