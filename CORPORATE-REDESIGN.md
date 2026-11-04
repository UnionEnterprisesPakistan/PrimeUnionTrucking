# Phase 1 — Corporate homepage (preview only)

This is an incremental, non-destructive redesign: three existing audience cards, original approved copy and their URLs are unchanged. The original app.js, booking calendar, backend, API and inner pages are unchanged.

**Watermelon usage:** Watermelon is a React/TypeScript component registry. Because this site is vanilla JavaScript, this phase adapts its polished entrance/hover motion patterns in CSS, not an imported Watermelon React component. Adding actual registry components requires a separate React migration and integration test. Do not represent this as Watermelon React installed.

## Windows PowerShell — apply on `corporate-redesign` branch

Extract the ZIP separately, and copy only these two files into your current repository:

- `public/assets/corporate-home.css` (new)
- `public/index.html` (adds one stylesheet link only)

Or, from your existing project folder after saving this ZIP to Downloads:

```powershell
git branch --show-current
Expand-Archive "$HOME\Downloads\prime-union-corporate-watermelon-phase1.zip" -DestinationPath "$HOME\Downloads\prime-union-corporate-extracted" -Force
Copy-Item "$HOME\Downloads\prime-union-corporate-extracted\prime-union-corporate-watermelon-phase1\public\assets\corporate-home.css" ".\public\assets\corporate-home.css" -Force
Copy-Item "$HOME\Downloads\prime-union-corporate-extracted\prime-union-corporate-watermelon-phase1\public\index.html" ".\public\index.html" -Force
npm run dev
```

Check the homepage and all three card links. Do not run `vercel --prod` on the redesign branch. After approval, use `git add public/index.html public/assets/corporate-home.css; git commit -m "Corporate homepage design phase 1"; git push origin corporate-redesign; vercel` for preview.

Known limitations: this is a visual first pass, not an audited production-ready redesign. Existing lead/database and calendar configuration still need production testing.
