# صحتي (Sehati)

Personal health tracker PWA: food logging by grams, calories and macros, water, steps, sleep, workouts with YouTube guides, monthly measurements, lab results, weekly plan and shopping list.

Live: https://sehati-lake.vercel.app

## Highlights
- **Installable and offline:** a Progressive Web App with a service worker, so it opens like a phone app and works without a connection.
- **Private by design:** on the deployed site all data stays on the device (localStorage); nothing is sent to a server. Backup and restore from Settings.
- **Calorie targets computed from the profile:** BMR with the Mifflin-St Jeor equation, then daily calorie and macro targets.
- **Progress charts drawn in plain SVG:** steps, water, sleep, weight and measurements, with no chart library.
- **Icons generated at build time:** `build.js` draws the PNG icons in code, so the repo holds no binary files.
- **Arabic first:** full right-to-left interface.

## Files
- `index.html`: the whole app (HTML, CSS, JS). Data is stored on the device (localStorage), with backup/restore from Settings.
- `sw.js`: service worker for offline use and install.
- `manifest.webmanifest`: app name, colors and icons for "Add to Home Screen".
- `build.js`: copies the app into `public/` and draws the PNG icons at build time.
- `vercel.json`: headers for the service worker and manifest.

## Deploy on Vercel
- Framework: Other
- Build command: `node build.js`
- Output directory: `public`
- Install command: `echo skip`

Designed & Developed by Nora Aldossari
