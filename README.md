# Pathway — clickable student portal prototype

Plain HTML, CSS and JavaScript. No install or build step.

## Run it from VS Code

1. Unzip the folder and open it in VS Code (**File → Open Folder…**).
2. Install the **Live Server** extension (by Ritwick Dey) if you don't have it.
3. Right-click `index.html` → **Open with Live Server**.
   The prototype opens in your browser and reloads every time you save a file.

Without Live Server you can also just double-click `index.html` to open it in a browser.

## Connect to Figma

This workspace includes the Figma remote MCP server in the root `.mcp.json`. In VS Code,
select **Copilot** as the chat harness, then open **Chat: Open Customizations** from the
Command Palette and select **MCP Servers**. Select `figma` and follow the sign-in prompt;
if the server is already configured but needs authorization, choose **Authenticate** from
its actions. Sign in to Figma and allow access when prompted. No access token is stored in
this project.

If the authentication browser does not open, try **MCP: List Servers** from the Command
Palette, select `figma`, and choose **Authenticate**. Use **Show Output** from the same
server actions to inspect connection errors. In a Remote SSH or other remote workspace,
complete sign-in in the browser on your local VS Code client; the server endpoint is
remote, but the browser flow is client-side. Check that VS Code can open links in your
local default browser. Do not copy access tokens into project files or chat.

Once connected, you can share a Figma frame or layer link in Copilot chat to work with its
design.

## Files

- `index.html` — page shell
- `styles.css` — colors (CSS variables at the top), layout and components
- `app.js` — sample data (`JOBS`, `BASE_EVENTS`), app state, one render function per screen in `screens`, and click/submit handlers
- Use the theme icon in the top bar to switch between light and dark modes. The selection applies across screens and resets on page reload.

## Screens

Student: Discover (keyword, work-location, and industry filters), Applications, Skill builder, Advanced search, Search results, Internship offer, Skill course, Profile (with the Update hard skills pop-up), Calendar.
Other views: Company profile, School home.

Try this flow: Discover → search for Great Match Inc. → open the internship → Docker shows as missing → Take course → Docker is added to your profile → Apply → the application appears under Applications and a follow-up appears on Oct 28 in the calendar.

State lives in memory, so a page reload resets it.
