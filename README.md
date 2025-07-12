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