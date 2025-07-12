# TESTING_STRATEGY.md

**Comprehensive Testing Strategy — Pollinations AI Web App**

This document provides detailed, actionable testing procedures for core security, functionality, and UX tasks (1–6) as marked completed in [`PROJECT_TASKS.md`](PROJECT_TASKS.md). It is intended for use by developers, QA engineers, collaborators, and external test auditors.

*Every section covers: objectives & scope, step-by-step procedures (manual/automated), required setup/environment, expected results & exit criteria, references, and notes for all audiences.*

---

## Table of Contents

1. [Restrict CORS Allowed Origins](#1-restrict-cors-allowed-origins)
2. [Scope Static Server Directory (Public Assets Only)](#2-scope-static-server-directory-public-assets-only)
3. [Add Security Warning to README/Onboarding/App Banner](#3-add-security-warning-to-readmeonboardingapp-banner)
4. [Monitor API Key Usage](#4-monitor-api-key-usage)
5. [In-App Creative Challenges & Tutorials](#5-in-app-creative-challenges--tutorials)
6. [Accessibility, Color Contrast, and Keyboard Checklist](#6-accessibility-color-contrast-and-keyboard-checklist)

---

## 1. Restrict CORS Allowed Origins
**(See [`server.py`](server.py), PROJECT_TASKS.md §1)**

### Objectives & Scope
- Ensure only a specific set of origins can access server resources via CORS.
- Prevent unauthorized cross-origin requests.
- Manual and automated verification of headers.

### Responsibilities
- Developers: Implement and maintain proper CORS configuration & logic.
- Testers/QA: Validate proper header behavior for allowed/denied origins and attempt bypass.

### Procedures

**Manual Testing**
1. Inspect CORS headers in DevTools when fetching resources from allowed, preview, and disallowed origins.
2. Use provided CLI commands:
   ```sh
   curl -i -H "Origin: http://localhost:8000" http://localhost:8080/
   curl -i -H "Origin: https://evil.com" http://localhost:8080/
   ```
   - Confirm only whitelisted origins (localhost, preview domains) receive `Access-Control-Allow-Origin`.

**Automated Testing (Recommended)**
- Script tests to send requests with various origins, asserting:
  - Allowed origins receive correct header.
  - Disallowed origins do not receive header or are explicitly denied.
- Ensure logs exist for failed CORS attempts if implemented.

**Recurring/Frequency**
- On change to CORS logic, deployment, or addition of new domains.

### Setup & Environments
- Local environment with `server.py` running.
- Updated allowed origins list in code and, if used, ENV vars.
- CLI tools: curl, Postman, or equivalent HTTP client.

### Expected Results & Exit Criteria
- Allowed domains consistently receive CORS headers.
- Disallowed requests are denied (header missing or set to deny).
- No wildcard (`*`) allowed in production.
- All tasks in PROJECT_TASKS.md §1 verified.

### References
- [`server.py`](server.py)
- PROJECT_TASKS.md task 1 (and code snippet)
- [MDN CORS docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- Security standards/guidelines

### Notes
- Audit logs for failed attempts recommended for future proofing.
- If scaling, consider framework-based CORS libs.


---

## 2. Scope Static Server Directory (Public Assets Only)
**(See [`server.py`](server.py), PROJECT_TASKS.md §2)**

### Objectives & Scope
- Serve only public, static assets (HTML, JS, CSS, images) from intended directory.
- Block attempts to access non-public files (e.g., source code, config).

### Responsibilities
- Developers: Keep static asset directory organized and secured in code.
- Testers: Verify access to allowed files and strict denial to disallowed paths.

### Procedures

**Manual Asset Checks**
1. Attempt to access `/static/*` assets—should load correctly.
2. Attempt to access sensitive or root files (e.g., `/server.py`, `/static/../server.py`); should receive HTTP 403 Forbidden.

**Automated Asset Verification**
- Use provided Python script to batch test:
  ```python
  import requests
  for path in ["/static/pig.html", "/static/app.js"]:
      assert requests.get(f"http://localhost:8088{path}").status_code == 200
  for path in ["/server.py", "/static/../server.py"]:
      assert requests.get(f"http://localhost:8088{path}").status_code == 403
  ```
- Run fuzzer or security scanning tools (Nikto, OWASP ZAP) to probe for file leaks.

**CI/CD/Recurring**
- Re-run on deployment, asset additions, or server logic changes.

### Setup & Environments
- [`server.py`](server.py) using updated `directory=` path to `static/`
- Asset directory (`static/`) populated and linked in HTML.
- Browser and command-line access.
- Test tools: curl, requests, fuzzer tools.

### Expected Results & Exit Criteria
- Assets in `/static` always delivered.
- Project root/confidential files never accessible.
- All denial and error cases return proper HTTP error codes.

### References
- [`server.py`](server.py:19-35), code snippets in PROJECT_TASKS.md §2.
- [OWASP Top 10: Sensitive Data Exposure](https://owasp.org/www-project-top-ten/)
- Security scanner tool docs

### Notes
- Use `truffleHog` for secret scans in repo history.
- Review `static/` before each deploy for accidental leaks.


---

## 3. Add Security Warning to README/Onboarding/App Banner
**(See [`README.md`](README.md), UI/app code, PROJECT_TASKS.md §3)**

### Objectives & Scope
- Alert users/testers to temporary API key risks and intended preview-only security.
- Ensure warnings are visible, descriptive, and persist as designed.

### Responsibilities
- Developers: Place and maintain documentation/app banner.
- QA/External Testers: Confirm placement, content, and UI persistence/control.

### Procedures

**README Verification**
1. Open [`README.md`](README.md).
2. Confirm presence of clear warning (emoji, wording) about preview and API key validity, near setup/use sections.

**In-App Banner Testing**
1. Launch application and check for banner on all key views.
2. Test dismissibility and persistence across sessions/tabs (e.g., via `localStorage` flag).
3. Confirm warning is NOT displayed after suppression, as intended.

**User Confirmation**
- Have new users acknowledge/read warning on first use and after banner display.
- Feedback loop: users confirm comprehension post-docs/use.

### Setup & Environments
- [`README.md`](README.md) and working app build.
- Browsers: clear `localStorage` state between persistence tests.

### Expected Results & Exit Criteria
- Security warning is shown, clear, and matches copy in docs and app.
- Banner is visible, can be dismissed, and its state persists as expected.
- New users/testers acknowledge the risk.

### References
- [`README.md`](README.md)
- App code for UI banner (relevant JS/HTML)
- PROJECT_TASKS.md §3
- [User onboarding best practices](https://www.nngroup.com/articles/user-onboarding/)

### Notes
- Banner style must be highly visible.
- Consider accessibility—make sure it’s screen reader friendly.


---

## 4. Monitor API Key Usage
**(No single file; relevant to all config/env/API, see PROJECT_TASKS.md §4)**

### Objectives & Scope
- Continuously monitor API key usage for abuse/unauthorized access.
- Enable emergency response and key rotation.
- Confirm app reacts correctly to key removal/invalidity.

### Responsibilities
- Developers: Ensure API key is stored in config/env—not hardcoded.
- Maintainers/Testers: Routinely check dashboard usage, enforce rotation protocol, and simulate failure.

### Procedures

**Routine Checks**
1. Log into provider dashboard (Pollinations or equivalent) at dev/test day start & end.
2. Review IP logs, usage stats for abnormal activity.

**Key Rotation Testing**
1. Force-rotate key on suspicion of abuse; update key in `.env` or config, and redeploy.
2. Notify all devs/testers of new key and any remediation steps.

**Emergency Revocation**
1. Remove/disable key in provider dashboard.
2. Attempt service access; app should log error/notify user gracefully.

**Automation**
- Optional: Calendar reminders for manual checks.
- Advanced: Write/reporting script to pull dashboard usage and email/alert team.

**Negative Testing**
- Delete key from config; verify app fails with clear error and prevents further API requests.

### Setup & Environments
- Admin access to API provider dashboard.
- Configured `.env`/settings files (do not hardcode keys).
- Team notification method (Slack, email, etc.).
- Scripting: shell/Python for automation.

### Expected Results & Exit Criteria
- Any usage spikes/unknown IPs detected early.
- Key successfully rotated/redeployed as needed, with full notification log.
- App handles revoked/invalid keys gracefully (not crashes or silent fail).

### References
- PROJECT_TASKS.md §4
- [API key security - Twelve-Factor App](https://12factor.net/config)
- Provider dashboard docs

### Notes
- Review key usage weekly, more often near launches.
- Doc revocation protocol in team handbook.


---

## 5. In-App Creative Challenges & Tutorials
**(See UI code, admin tools, PROJECT_TASKS.md §5)**

### Objectives & Scope
- Verify challenge/tutorial creation, display, submission, and admin updates are robust and engaging.
- Track user engagement with challenges and learning content.

### Responsibilities
- Developers: Design extensible framework; allow admin/user updates without redeploy.
- QA/Testers: Validate all flows (listing/engagement, submission, results, update).

### Procedures

**Framework/UI Logic**
1. Add, edit, and delete challenges/tutorials using admin pathway (if present).
2. Confirm new and updated challenges show up immediately (or as designed) on user dashboard/UI components.
3. Step through tutorial flows—check for guidance, completion tracking, edge cases (back-jump, skip-steps).

**User Engagement**
- Submit responses as a user. Confirm tracking, correctness, and correct feedback/recognition for completed challenges.
- Review client/server logs for submission and errors.

**Updateability/Admin Feeds**
1. Update challenge/tutorial data files or admin interface (as available) without rebuilding app.
2. Validate changes reflected in user-facing UI.

**Metrics/Tracking**
- Check analytics for completion, drop-off rates.
- Survey/test with users and gather qualitative feedback.

### Setup & Environments
- Admin credential or role for updating/managing challenges.
- Local/test server with sample users, both admin and user access.
- Analytics/dashboard access if implemented.

### Expected Results & Exit Criteria
- All CRUD actions on challenges/tutorials function as specified.
- Users can complete/submit; submissions persist.
- Updates reflect in UI, no deploy/restart required.
- Metrics/BIs log events.

### References
- UI logic for challenges/tutorials (JS, admin interface)
- PROJECT_TASKS.md §5
- Engagement metric docs/tools

### Notes
- Ensure sample data covers edge cases.
- Track user sentiment via survey as supplement.


---

## 6. Accessibility, Color Contrast, and Keyboard Checklist
**(See UI, CSS, JS, HTML—PROJECT_TASKS.md §6)**

### Objectives & Scope
- Test and remediate accessibility, ARIA labeling, contrast, keyboard navigation, and multi-theme compliance for all user interfaces.

### Responsibilities
- Developers: Implement guidelines and remediate issues.
- QA/External Testers: Audit, validate, and solicit reviews from users with accessibility needs.

### Procedures

**Keyboard Navigation**
- Tab/shift-tab all controls; ensure sequential, predictable order, and visible focus.
- Attempt all workflows (form submission, menu nav) using only keyboard.
- Test with screen reader for announcements.

**ARIA and Labels**
- Inspect each UI component (via DevTools, axe) for correct ARIA labels, roles, and accessible descriptions.

**Color Contrast**
- Run Lighthouse, axe, or equivalent on every page/state in both dark and light themes.
- Remediate any elements not meeting WCAG 2.1 AA standards (see tool reports).

**Theme Toggle**
- Activate both dark and light mode manually; verify contrast and accessibility in both.
- Confirm setting persists as intended.

**Progress Indicators**
- For any async/generation actions, confirm progress status is visible and accessible (aria-live, etc.).

**Remediation & Review**
- Document all remaining issues with screenshots/descriptions.
- Prioritize and fix critical findings; record resolutions.
- Solicit feedback from at least one outside tester or user with accessibility tools/tech, and log results.

### Setup & Environments
- Accessible build of app in local and test environments.
- Tools: Chrome DevTools, [axe](https://www.deque.com/axe/), [Lighthouse](https://developers.google.com/web/tools/lighthouse/), screen readers (NVDA, VoiceOver).
- Both dark and light mode enabled.

### Expected Results & Exit Criteria
- Full keyboard navigation, proper ARIA, color contrast compliance in all modes/themes.
- All issues from tools/manual checks remediated or documented for next sprint.
- Third-party review is completed; failures are logged and actioned.

### References
- PROJECT_TASKS.md §6
- [WCAG Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [axe Core Docs](https://dequeuniversity.com/rules/axe/4.8/)
- [Lighthouse Docs](https://web.dev/accessibility/)

### Notes
- Re-test after any major UI/UX change.
- Consider periodic reviews by accessibility experts.


---

## Document Revision and Audit

- Testing strategy should be updated whenever new functional, security, or UI features are added.
- This document serves as the canonical QA checklist and as external audit proof for the listed critical tasks.

## Automated Accessibility Audits

### axe-core CLI (or axe-playwright)

Run automated accessibility audits locally or in CI using axe-core. Target your running application (e.g., http://localhost:8088):

**Setup:**
```sh
npm install --save-dev axe-core-cli
# or for advanced scenarios (SPA/interactions):
npm install --save-dev axe-playwright playwright
```

**Example package.json script:**
```json
{
  "scripts": {
    "a11y:test": "axe http://localhost:8088"
  }
}
```

**Usage:**
```sh
npm run a11y:test
# or for custom URLs:
npx axe http://your-test-url
```

*For pages requiring authentication/actions, consider [`axe-playwright`](https://github.com/dequelabs/axe-playwright) to script user flows.*

---

### Lighthouse CLI

Run audits for accessibility and overall quality via Google Lighthouse.

**Setup:**
```sh
npm install --save-dev lighthouse
```

**Basic usage (headless, CI-friendly):**
```sh
npx lighthouse http://localhost:8088 --output html --output-path ./lighthouse-report.html --only-categories=accessibility
```

**Recommended for automated runs:**  
- Use the above command after your app/server has started and is accessible.
- For continuous integration:  
  Run Lighthouse as a step after deployment/build to capture reports.

**Exporting reports:**  
- The `--output-path` flag writes HTML or JSON reports for further review or storage.

---

### Limitations

- Automated tools may miss issues with dynamic overlays, modals, or content requiring interaction.
- Some findings require manual/subjective review (color contrast, logical tab order, context).
- Always supplement automated audits with periodic manual testing (e.g., screen readers/keyboard navigation).

For more, see the official docs:  
- [axe-core CLI](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/cli/README.md)  
- [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse#using-the-node-cli)
