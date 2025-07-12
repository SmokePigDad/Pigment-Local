# IMPORTANT SECURITY WARNING

**This deployment uses a temporary API key. Do not share this link.**

---

## Production Launch Checklist

Before going live with a production deployment, ensure the following steps are completed:

- [ ] **Remove Temporary API Key:** Replace the temporary API key with a permanent, securely managed API key.
- [ ] **Restrict Domain Access:** Configure your API and application to restrict access to only your authorized production domain(s).
---

## API Key Security Monitoring & Rotation Guide

- **Regularly Monitor Usage:** Log into the [Pollinations dashboard](https://dashboard.pollinations.ai/) and review API activity and key usage statistics at least daily during periods of active deployment.
- **Look for Signs of Misuse:** Unexpected spikes in traffic, API calls from unrecognized sources/domains, or sustained high-volume requests may indicate misuse.
- **Respond to Suspicious Activity Immediately:**
  - Disable or rotate your API key via the dashboard.
  - Investigate server and application logs for potentially exposed keys or unauthorized access.
  - Inform team members if key misuse is suspected.
- **Key Rotation Steps:**
  - Visit the dashboard to generate a new API key.
  - Update environment/configuration files as needed.
  - Redeploy the service *without* the compromised key.
- **Best Practices:**
  - Never commit API keys to version control.
  - Restrict all key usage to approved origins/domains.
  - Remove and rotate any key that may have been disclosed in a shared environment.

*Set a reminder to check dashboard usage weekly even outside active development.*
---
## In-App Creative Challenges & Tutorials (Admin/Developer Guide)

### How to Add or Update Challenges & Tutorials:

Creative challenges and tutorials are fully editable directly in [`pig.html`](pig.html).  
Navigate to the script section marked:
```
/* ==== CREATIVE CHALLENGES & TUTORIALS: editable framework ====  */
const CHALLENGES = [ ... ];
```
Each challenge/tutorial entry is a JavaScript object with:
- `title`: Display name for the challenge or tutorial.
- `desc`: Descriptive text for users.
- `steps`: Array of string steps for the tutorial overlay (can be empty for challenge-only).
- `example`: (Optional) Example entry/prompt displayed for guidance.

**To add/update:**  
- Edit or create entries in the `CHALLENGES` array; changes are instant on page reload.
- You can reorder, remove, or rotate challenges by changing which one is loaded in `renderCurrentChallenge(index)`.

### In-App Flow:
- Challenges/tutorials are shown above Generation Settings in the UI.
- Tutorial walkthrough overlays are launched by "Start Tutorial."
- Admin or developer changes only require editing the `CHALLENGES` array; no redeploy required.

For onboarding, accessibility, and extending challenge types, see further below.

---
## Accessibility, Keyboard, and Color Contrast

This app is designed with accessibility and inclusive UX in mind:

- **Full Keyboard Navigation**: All controls, buttons, dropdowns, and galleries are fully keyboard-accessible via Tab and Shift+Tab. All interactive elements show a clear focus ring.
- **Screen Reader Support**: All major form fields, buttons, and dynamic areas (gallery, progress, status) include ARIA labels and roles; live regions announce image generation status and results.
- **Theme Toggle**: Use the top-right "Toggle Theme" button to switch between dark and light modes. Both meet or exceed [WCAG AA color contrast](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=143#contrast-minimum) guidelines for text and controls.
- **Visible Progress for Background Tasks**: Any long-running operation (image generation, etc.) includes a visible progress bar and screenreader announcement.
- **Onboarding Guide**: First-time users can run an in-app tutorial overlay from the "Start Tutorial" button above Generation Settings.

### Accessible Theming & Extensibility

- Color palette is WCAG-validated and toggles between two accessible themes.
- Custom styles for focus and live announcements are included.
- For adding or improving a11y support (e.g., further ARIA, custom screenreader text), edit [`pig.html`](pig.html) and refer to `role`, `aria-label`, and `tabindex`.

### Known Gaps & Remediation

- Current submissions from the Challenge Hub are not persisted (demo only).
- If any further gaps in accessibility are found, open a GitHub issue or contact the maintainers for priority remediation.

---
