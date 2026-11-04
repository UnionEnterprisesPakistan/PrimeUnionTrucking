# The Longer Road — Editorial V2

This is a layout redesign, not just a palette change. The homepage uses one primary owner-operator panel plus two secondary customer choices (three total), real readable emoji wayfinding, larger typography, and a split editorial hero. Inner-page offerings are numbered editorial rows rather than repeated mini-cards. Decorative marquee, animated numeric stats, and extra floating contact buttons are removed.

Original wording, 4 routes, Express backend, database/API code, calendar scripts and form fields are retained. Client-facing claims should be verified by business owners before public launch.

## Test safely

1. Extract to a NEW folder (do not overwrite production).
2. `npm install` then `Copy-Item .env.example .env` and `npm run dev`
3. Verify homepage, `/owner-operator`, `/fleet`, `/getting-started`, and calendar/form operations locally.
4. Deploy preview on corporate-redesign branch only, not `vercel --prod`.

The React-based Watermelon library was not copied or installed; the animation treatments are an original CSS adaptation so the existing vanilla JS frontend and backend stay compatible.
