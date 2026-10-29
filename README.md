# Internship app — clickable prototype

Plain HTML, CSS and JavaScript. No install or build step.

## Run it from VS Code

1. Unzip the folder and open it in VS Code (**File → Open Folder…**).
2. Install the **Live Server** extension (by Ritwick Dey) if you don't have it.
3. Right-click `index.html` → **Open with Live Server**.
   The prototype opens in your browser and reloads every time you save a file.

Without Live Server you can also just double-click `index.html` to open it in a browser.

## Files

- `index.html` — page shell
- `styles.css` — colors (CSS variables at the top), layout and components
- `app.js` — sample data (`JOBS`, `BASE_EVENTS`), app state, one render function per screen in `screens`, and click/submit handlers

## Screens

Student: Search home, Advanced search, Search results, Internship offer, Skill course, Profile (with the Update hard skills pop-up), Calendar.
Other views: Company profile, School home.

Try this flow: search → open Great Match Inc. → Docker shows as missing → Take course → Docker is added to your profile → Apply → a follow-up appears on Oct 28 in the calendar.

State lives in memory, so a page reload resets it.
