# Pollinations AI Web App: Project Task Tracker

---

## Current Tasks

### 7. Visible Progress Feedback

**Detailed Action Plan:**
- **Identify All Async/Deferred Actions:**
  Review all frontend workflows including image generation, API calls, file uploads, and processing tasks.
- **Progress/UI Elements:**
  Implement progress indicators (spinners, progress bars, skeleton loaders) at every async entry point; ensure visible feedback appears on request initiation.
- **Feedback for Success/Failure:**
  Add status areas/alerts clearly communicating completion or error (using ARIA live regions for accessibility).
- **Link UI to State:**
  Tie indicator rendering to live request/promise state or context, keeping the UI responsive and never stale.
- **Testing:**
  Confirm that all user workflows (especially image/gen/submit) show appropriate progress at every step, and update during network delays.

---

### 8. Quick Start Guide in README

**Detailed Action Plan:**
- **Comprehensive Onboarding Steps:**
  Update `README.md` with dead-simple instructions for:
    - Cloning the repo
    - Installing dependencies
    - Registering or protecting API keys
    - Local development start
    - Deploy/test on popular platforms (vercel/netlify/docker or as relevant)
- **Troubleshooting Section:**
  Add a clearly labeled troubleshooting/FAQ area with fixes for common dev/tester mistakes, permission/config/gotchas, and how to get help.
- **Screenshots/Tips:**
  Add example screenshots of initial UI, setup steps, or successful configuration for a fast start.
- **Feedback/Support Info:**
  Point to bug tracker, chat, or support channel.

---



## Done Tasks

### 5. [x] In-App Creative Challenges & Tutorials

**Detailed Action Plan:**
- **Challenge and Tutorial Framework:**
  Design and implement a system for creating, curating, and managing creative challenges for users—including a rotating or curated prompt set that introduces new techniques, model features, or creative goals.
- **UI/UX and Onboarding:**
  Build user interface elements to prominently display current challenges and in-app tutorials, allowing step-by-step guidance for both new and advanced users.
- **Submission and Showcasing:**
  Allow users to enter responses, optionally display top submissions or learning samples, and provide feedback or recognition.
- **Developer/Admin Guidance:**
  Document the process for adding or updating challenges and tutorials without redeploying the app.
- **Review and Metrics:**
  Track user engagement, completion rates, and survey feedback to improve future tutorials and challenges.

---

### 6. [x] Run Accessibility, Color Contrast, and Keyboard Checklist

**Detailed Action Plan:**
- **Keyboard Navigation:**
  Tab and shift-tab through all interactive controls. Audit and fix focus order. Add visible focus states and test with a screen reader.
- **ARIA and Labels:**
  Ensure all controls, forms, and major UI components have screen-reader-accessible ARIA labels and clear descriptions.
- **Color Contrast:**
  Use automated tools (e.g., Lighthouse, axe, or browser inspectors) to validate all text and control elements meet or exceed WCAG AA contrast guidelines.
- **Theme Toggle:**
  Implement and test dark and light mode themes across the app. Confirm accessibility and contrast in both themes.
- **Progress Indicators:**
  Audit all app workflows (especially generation tasks) for visible feedback (e.g., spinners, status bars) and accessible labels/announce regions.
- **Accessibility Remediation:**
  Document remaining issues, prioritize remediation, and provide references to relevant guides/tools.
- **Verification:**
  Ask outside testers or users with accessibility tech to review and supply feedback; record success and failures.

---


**Action Plan:**
- **Locate CORS in the Code:**
  Open [`server.py`](server.py), find the section where headers are sent (look for `send_header` and `"Access-Control-Allow-Origin"`).
- **Modify Code to Restrict Origins:**
  Replace `*` with a whitelist. Example:
  ```python
  ALLOWED_ORIGINS = { "http://localhost:8000", "https://preview.pollinations.ai" }
  preview = os.environ.get("PREVIEW_DOMAIN")
  if preview:
      ALLOWED_ORIGINS.add(preview)
  origin = self.headers.get('Origin')
  if origin in ALLOWED_ORIGINS:
      self.send_header('Access-Control-Allow-Origin', origin)
  ```
- **Allow Localhost and Preview Domains:**
  Ensure your local dev URLs and any preview URL controlled by env var are supported, and document in a comments block.
- **Testing:**
  - Use browser DevTools and inspect responses.
  - Run:
    ```
    curl -i -H "Origin: http://localhost:8000" http://localhost:8080/
    curl -i -H "Origin: https://evil.com" http://localhost:8080/
    ```
    Only allowed domains should receive the header.
- **Libraries & Best Practices:**
  Use a web framework or Flask-CORS for extensibility if the project scales, and log all failed CORS attempts.

---

### 2. [x] Scope Static Server Directory (Public Assets Only)

**Action Plan:**
- **Locate Static File Serving:**
  Find where [`CustomHTTPRequestHandler`](server.py:19-35) sets `directory=`. It likely defaults to project root. Change to `/static` assets folder.
- **Directory Scoping in Code:**
  Example update:
  ```python
  class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
      STATIC_ROOT = Path(__file__).parent / "static"
      def __init__(self, *args, **kwargs):
          super().__init__(*args, directory=str(self.STATIC_ROOT), **kwargs)
      def do_GET(self):
          if self.path == '/':
              self.path = '/pig.html'
          if '..' in self.path or self.path.startswith('/..'):
              self.send_error(403, "Forbidden")
              return
          allowed = ('.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico')
          if not any(self.path.lower().endswith(ext) for ext in allowed):
              self.send_error(403, "Unsupported file type")
              return
          return super().do_GET()
  ```
- **Organize/Migrate Assets:**
  Move all HTML, JS, CSS, images to `/static`. Update URLs in your HTML code to reference `/static/` so all served assets live in this folder.
- **Verification:**
  - Manually check `/static/*` assets load in browser.
  - Try to access `/server.py`, `/static/../server.py`—expect 403s.
  - Use a script:
    ```python
    import requests
    for path in ["/static/pig.html", "/static/app.js"]:
        assert requests.get(f"http://localhost:8088{path}").status_code == 200
    for path in ["/server.py", "/static/../server.py"]:
        assert requests.get(f"http://localhost:8088{path}").status_code == 403
    ```
  - Scan for asset/file leaks using Nikto, OWASP ZAP, or fuzzer tools.
- **Leak Prevention:**
  Use truffleHog for git history. Review new files before hosting.

---

### 3. [x] Add Security Warning to README/Onboarding/App Banner

**Detailed Action Plan:**
- **Add Documentation Warning:**
  Edit `README.md` with a bold/emoji header: “⚠️ This preview uses a temporary API key. Do not share deployment links. Key will be invalidated at public launch.”
  Place near setup and usage instructions.
- **In-App UI Warning Banner:**
  Add a visible, dismissible banner component to all views with clear copy about preview mode and API key risk.
  Option to suppress for future visits (e.g., store flag in `localStorage`).
- **Verification:**
  Open app and observe warning on first load; dismiss and check persistence.
  Have user/tester confirm understanding after following docs and using app.

---

### 4. [x] Monitor API Key Usage

**Detailed Action Plan:**
- **Routine Dashboard Checks:**
  Log into Pollinations account at start/end of each dev/test day.
  Review auth logs for unexpected or high activity IPs/domains.
- **Set Key Rotation Policy:**
  If the dashboard shows anomalous usage, rotate/regenerate API key immediately and replace in local `.env` or config files.
- **Emergency Revocation Process:**
  Document steps for key revocation and notification of downstream testers/collaborators.
- **Automate or Calendarize Checks:**
  Use calendar reminders; consider a shell script to send dashboard usage summaries.
- **Testing:**
  Remove your API key manually and confirm service fails as expected for unauthorized domains.

---

### 6. Run Accessibility, Color Contrast, and Keyboard Checklist

**Detailed Action Plan:**
- **Keyboard Navigation:**
  Tab and shift-tab through all interactive controls. Audit and fix focus order. Add visible focus states and test with a screen reader.
- **ARIA and Labels:**
  Ensure all controls, forms, and major UI components have screen-reader-accessible ARIA labels and clear descriptions.
- **Color Contrast:**
  Use automated tools (e.g., Lighthouse, axe, or browser inspectors) to validate all text and control elements meet or exceed WCAG AA contrast guidelines.
- **Theme Toggle:**
  Implement and test dark and light mode themes across the app. Confirm accessibility and contrast in both themes.
- **Progress Indicators:**
  Audit all app workflows (especially generation tasks) for visible feedback (e.g., spinners, status bars) and accessible labels/announce regions.
- **Accessibility Remediation:**
  Document remaining issues, prioritize remediation, and provide references to relevant guides/tools.
- **Verification:**
  Ask outside testers or users with accessibility tech to review and supply feedback; record success and failures.

---
- **In-App UI Warning Banner:**
  Add a visible, dismissible banner component to all views with clear copy about preview mode and API key risk.
  Option to suppress for future visits (e.g., store flag in `localStorage`).
- **Verification:**
  Open app and observe warning on first load; dismiss and check persistence.
  Have user/tester confirm understanding after following docs and using app.

---

### 4. Monitor API Key Usage

**Detailed Action Plan:**
- **Routine Dashboard Checks:**  
  Log into Pollinations account at start/end of each dev/test day.
  Review auth logs for unexpected or high activity IPs/domains.
- **Set Key Rotation Policy:**  
  If the dashboard shows anomalous usage, rotate/regenerate API key immediately and replace in local `.env` or config files.
- **Emergency Revocation Process:**  
  Document steps for key revocation and notification of downstream testers/collaborators.
- **Automate or Calendarize Checks:**  
  Use calendar reminders; consider a shell script to send dashboard usage summaries.
- **Testing:**  
  Remove your API key manually and confirm service fails as expected for unauthorized domains.

---

### 5. Run Accessibility/Contrast/Keyboard Checklist

**Detailed Action Plan:**
- **Keyboard Navigation:**  
  Use Tab and Shift+Tab to traverse all controls on each view; focus should be visible and not lost.
- **ARIA and Screen Reader:**  
  Add `aria-label`, `aria-live`, and roles to actionable and dynamic UI components.
  Use a screen reader to verify controls and feedback.
- **Color Contrast:**  
  Use tools (axe devtools, Lighthouse, Color Oracle) to test contrast of all text/background/UI combinations.
  Adjust colors to meet at least WCAG AA (4.5:1) for text.
- **Issue Logging & Fix:**  
  For every accessibility/contrast failure, log as a ticket and resolve.
- **Verification:**  
  Re-run tests in a clean/guest browser profile and accessibility mode.

---

### 6. Publish Quick Start + Testing Instructions

**Detailed Action Plan:**
- **Quick Start in README:**  
  Add commands for clone, install, run, access, troubleshoot.
  Include sample commands for Windows/Mac/Linux, and notes for required Python/node versions.
- **Testing Instructions:**  
  Include steps to run unit/E2E tests.
  List test dependencies and coverage command.
- **Peer Verification:**  
  Ask a tester to follow the guide from scratch, note any gaps, and revise to remove friction.

---

### 7. Visible Progress Feedback

**Detailed Action Plan:**
- **Audit Async Flows:**  
  List every user action that could be non-instant (generation, uploads).
- **UI Feedback Components:**  
  Add progress bars, animated spinners, or status text for each as needed.
- **Prevent Double-Submit:**  
  Disable UI controls while jobs are pending.
- **Network Slowdown Test:**  
  Simulate poor connections in DevTools and validate feedback remains responsive.
- **User Validation:**  
  Have a user perform a slow generate and rate feedback clarity.

---

### 8. Color Contrast & Light/Dark Mode Toggle

**Detailed Action Plan:**
- **Centralize Theme and Palettes:**  
  Refactor CSS to use variables for all color values.
- **Toggle Implementation:**  
  Add a persistent dark/light mode toggle.
  Default to system color scheme where possible.
- **Accessibility Testing:**  
  Use contrast tools to validate every theme option.
  Log and address any non-compliance.
- **Visual Review:**  
  Test switch on a tablet/mobile device.

---

### 9. Minimal Localization (Optional)

**Detailed Action Plan:**
- **i18n Architecture:**  
  Move all app strings to a translation file (JSON or JS object).
  Pick one additional language and translate.
- **UI Language Switcher:**  
  Add drop-down or icon for language switch in header/footer.
- **Test All Strings:**  
  Confirm both languages show complete content; if fallback, flag as TODO.
- **Translator Validation:**  
  If possible, confirm with a fluent/native reader.

---

### 10. Basic Unit/E2E Tests

**Detailed Action Plan:**
- **Set Up Test Frameworks:**  
  Install Jest (frontend) and Pytest (backend, if needed).
- **Write Test Cases:**  
  Core flows: valid/invalid prompt, submit, image appears, errors recover.
- **E2E Test:**  
  Record a Playwright/Cypress script navigating start-to-image.
- **CI/CD Integration:**  
  Hook test scripts to a free CI service.
- **Coverage + Documentation:**  
  Run tests and report/cover in docs.

---

### 11. In-App Tutorials/Onboarding Guide

**Detailed Action Plan:**
- **User Flow and Steps:**  
  Storyboard typical first-run and advanced flows.
- **Guide Implementation:**  
  Use a library or custom tooltip overlay.
  Add "Skip", "Next", and "Show Again" options.
- **Review and Update:**  
  Test on incognito or cleared local storage.
  Gather first-timer feedback and iterate.

---

### 12. Remove API Key & Register Production Domain

**Detailed Action Plan:**
- **Remove from All Code/Config:**  
  Search codebase and .env files; eliminate references.
- **Register Production Domain:**  
  Submit to Pollinations admin; document validation.
- **Verify Deployed Site:**  
  Confirm requests succeed only from new domain.
- **Document Migration:**  
  Add "API Key Removed" and "Live Domain" checklist to README.

---

### 13. Finalize CORS Policy for Production Domain

**Detailed Action Plan:**
- **Code Update:**  
  Lock `ALLOWED_ORIGINS` to production only.
  Remove preview/test/localhost from prod build.
- **Deploy and Validate:**  
  Redeploy site, verify via browser and curl again.
- **Documentation:**  
  Mark cutoff process and policy for contributors.

---

### 14. Confirm Static Asset Exposure (Final Scan)

**Detailed Action Plan:**
- **Security Scan:**  
  Use Nikto, OWASP ZAP, or a static asset crawler against production.
- **Manual Path Testing:**  
  Validate only `/static/` allowed for assets.
- **Test Negative Cases:**  
  Paths like `/server.py`, `/static/../server.py` must 403/404.
- **Post-Release Checklist:**  
  Record all test results, sign off as part of release.

---

### 15. Clear CONTRIBUTING.md For External Collaboration

**Detailed Action Plan:**
- **Repo Policy:**  
  List test/commit/push/pr/docs requirements.
- **Example Section:**  
  Standard branch/naming scheme, who reviews, what needs a test.
- **Walkthrough:**  
  Have a new contributor make a test PR and capture problems.

---

### 16. Personalized Style Profiles

**Detailed Action Plan:**
- **UI and Storage:**  
  Add "Save as Profile" and loader to generation opts; persist to localStorage.
- **State Model:**  
  Ensure profiles save style, model, advanced options.
- **User Testing:**  
  Try save/load in fresh browser session.

---

### 17. In-App Creative Challenges & Tutorials

**Detailed Action Plan:**
- **Challenge Backend (or Static):**  
  Stand up a file or endpoint listing active challenges.
- **UI/Submission:**  
  Display current/past challenges, enable prompt submissions.
- **Recognition:**  
  Display top/selected entries, badge users.

---

### 18. Visual Inspiration Feed / Community Gallery

**Detailed Action Plan:**
- **Gallery/Feed UI:**  
  List paginated or infinite gallery, each with prompt link.
- **Moderation:**  
  Confirm only safe/suitable content visible.
- **Favorites:**  
  Allow users to "star"/save prompts/images.

---

### 19. Collaborative Prompt Workshops

**Detailed Action Plan:**
- **Share/Remix Workflow:**  
  Tag prompts as public/shared, enable remix, comment, vote.
- **Moderation and Privacy:**  
  Add rules, moderation backend/flagging.

---

### 20. Real-Time/Thumbnail Image Generation Feedback

**Detailed Action Plan:**
- **Partial/Progressive UI:**  
  Animate progress, add thumbnail if backend enables.
- **Fallbacks:**  
  Display warnings for jobs that stall or error.

---

### 21. Advanced Accessibility, Multi-Language, and UI Simplification

**Action Plan:**
- **Simple Mode:**  
  Add larger buttons, hide secondary controls, label "Simple UI".
- **Language Expansion:**  
  Add 3+ more UI language packs and ensure dynamic switching.
- **Alt Input:**  
  Add full accessibility navigation, ARIA, and alt descriptions.

---

### 22. Story-Driven Social Sharing and Remixes

**Action Plan:**
- **Share Engine:**  
  Implement one-click share for each prompt/gallery, create landing page for each.
- **Meta and Privacy:**  
  Allow each link to be private/public, explain data usage.
- **Test Flows:**  
  Validate sharing and link tracking across devices/services.

---

## Phase 2 (Live Launch) — End-to-End Steps

### 23. Conduct Go-Live Readiness Review

**Action Plan:**
- **Checklist Review:**  
  Reconfirm all previous tasks (1–22) are completed, checked, and documented as passed.
- **Live URL Dry Run:**  
  Visit new production domain from separate networks, regions, and browser types to confirm consistent, secure, and performant behavior.
- **Collaborator Review:**  
  Assign key test accounts for a full pass of the app; request feedback/bug reports.
- **Pre-launch Rollback Plan:**  
  Create a short rollback doc for disabling the site or restoring the previous state in the event of a critical launch failure.
- **Documentation Update:**  
  Mark all go-live documentation with date, revision, and owner.

---

### 24. Enable Traffic Analytics & Error Logging

**Action Plan:**
- **Analytics Integration:**  
  Add privacy-respecting analytics (e.g., Plausible, Matomo) to monitor app usage, retention, and feature engagement.
- **Error Logging:**  
  Integrate or configure a JavaScript error tracker (e.g., Sentry).
- **Verify Data:**  
  Generate sample events/errors to ensure they are captured in both analytics and error logging.
- **Review & Iterate:**  
  Use insights from logs/analytics for post-launch fixes and improvements.

---

### 25. Publicize, Announce & Open Community Channels

**Action Plan:**
- **Public Announcement:**  
  Prepare an announcement for chosen channels (socials, Discord, Reddit, forums, mailing list).
- **Community/Support Links:**  
  Add visible links in the app to Discord, email, documentation, FAQs.
- **Engagement Kickoff:**  
  Schedule a “launch event” challenge or mini-competition if desired.
- **Monitor Channels:**  
  Assign team or schedule monitoring of feedback/report inboxes in first weeks.

---

### 26. Post-Launch Monitoring and Rapid Response

**Action Plan:**
- **Monitor Uptime/Response:**  
  Install an external uptime monitor.
- **Daily Review/Check-ins:**  
  Assign team responsibility per day/week for quick response to issues or hotfixes.
- **Document User Issues:**  
  Collect, triage, and prioritize post-launch bug reports, improvements, and feature requests.

---

### 27. Retrospective and Iteration Planning

**Action Plan:**
- **Post-Launch Review:**  
  Conduct a project retrospective meeting (or async survey) for what went well and what can improve.
- **Update Task Backlog:**  
  Create new tasks in this tracker from community/user/analytics findings.
- **Celebrate!:**  
  Share milestones, thank contributors/users, and document “what’s next.”

---
