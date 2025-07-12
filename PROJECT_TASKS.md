# Pollinations AI Web App: Project Task Tracker

---

## Current Tasks

### 1. Restrict CORS Policy to Preview/Test Domain(s)

**Step-by-Step Action Plan:**
- Locate all CORS-related header logic in `server.py` (look for `Access-Control-Allow-Origin`).
- Replace `*` with a whitelist of origins, supporting `localhost` and configurable preview domains via an environment variable.
- Example:
  ```python
  ALLOWED_ORIGINS = { "http://localhost:8000" }
  preview = os.environ.get("PREVIEW_DOMAIN")
  if preview:
      ALLOWED_ORIGINS.add(preview)
  origin = self.headers.get('Origin')
  if origin in ALLOWED_ORIGINS:
      self.send_header('Access-Control-Allow-Origin', origin)
  ```
- Test via browser DevTools and `curl`, confirming only allowed origins receive the header.
- For extensibility, use a proper framework and load origins from config.
- Never use `*` in production.

---

### 2. Scope Static Server Directory (Public Assets Only)

**Step-by-Step Action Plan:**
- Move all public assets (HTML, CSS, JS, images) into a `/static` folder.
- Refactor `server.py`’s handler to set `directory` to `static`.
- Implement request filtering to block `..` and allow only asset file types:
  ```python
  if '..' in self.path or not self.path.endswith(('.html', '.css', '.js', '.png', ...)):
      self.send_error(403, "Forbidden")
  ```
- Update all HTML references to `/static`.
- Manually and automatically test:
  - Confirm `/static/*` files are accessible, all others are not.
  - Attempt accessing `/server.py`, `/static/../server.py`, etc., and check they’re blocked.
  - Scripted tests and use of static asset fuzzer/checks.
- Use secret scanning to prevent leaks (truffleHog etc.).

---

## Tasks To Do

### 3. Add Security Warning to README/Onboarding/App Banner

- Draft warning in documentation and implement dismissible in-app banner for API key awareness.
- Remind users NOT to share preview links.

### 4. Monitor API Key Usage

- Set up periodic review with the Pollinations dashboard.
- Prepare a process to rotate and revoke keys quickly in case of misuse.

### 5. Run Accessibility/Contrast/Keyboard Checklist

- Keyboard navigation and ARIA testing.
- Verify focus states and that controls are accessible by keyboard/screenreader.
- Validate color contrast (using tools like axe).

### 6. Publish Quick Start + Testing Instructions

- Draft `README` quick start, install, and troubleshooting.
- Add info on test/deploy cycle, configure testing scripts.

### 7. Visible Progress Feedback

- For all async/generation flows, maintain or add progress indicators and clear feedback.

### 8. Color Contrast & Light/Dark Mode Toggle

- Implement theme toggler; test contrast with accessibility tools.

### 9. Minimal Localization (Optional)

- Add support for basic language switching if possible.

### 10. Basic Unit/E2E Tests

- Implement basic Jest (frontend) and Pytest (backend) suites.
- Add CI integration if feasible.

### 11. In-App Tutorials/Onboarding Guide

- Write interactive onboarding overlay/dialog or tooltip guide.

### ... (continue for other future steps as they arise)

---

**Instructions:**  
- Add completed action plans to "Current Tasks", removing them from "Tasks To Do".
- For each major new roadmap step, first create a discrete plan before implementation.
