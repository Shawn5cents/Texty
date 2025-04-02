# Deployment Guide: Texty - AI Text Enhancement PWA (Cloudflare Pages)

## 1. Introduction

This document provides instructions on how to deploy the Texty PWA to Cloudflare Pages for global accessibility.

## 2. Prerequisites

*   A GitHub repository with your Texty PWA code.
*   A Cloudflare account.

## 3. Deployment Steps

1.  **Prepare your repository:**
    *   Ensure your repository includes all PWA files: `index.html`, `manifest.webmanifest`, `sw.js`, `offline.html`, `dist/output.css`, `script.js`, `auth.js`, `api/` (Cloudflare Workers), etc.
    *   Confirm `package.json` and `package-lock.json` are in the root for npm builds.

2.  **Create a Cloudflare Pages project:**
    *   Log in to your Cloudflare account and navigate to "Pages."
    *   Click "Create a project."
    *   Click "Connect to Git" and select your Texty repository.
    *   Choose the repository branch you want to deploy (e.g., "main").

3.  **Configure build settings:**
    *   **Framework preset:** None (or "Create React App" if it best matches your setup - "None" is generally suitable for basic HTML/JS projects)
    *   **Build command:** `npm run build`
    *   **Build output directory:** `dist` (or `/` if your built files are in the root)
    *   **Environment variables (Optional):** Add any necessary environment variables, such as API keys, in the "Environment variables" section. For Gemini API key, you might add `GEMINI_API_KEY` with your API key value.

4.  **Deploy the PWA:**
    *   Click "Save and deploy." Cloudflare Pages will automatically build and deploy your PWA.
    *   Monitor the deployment progress in the Cloudflare Pages dashboard.

5.  **Access your deployed PWA:**
    *   Once deployed, Cloudflare Pages will provide a unique URL (e.g., `your-project-name.pages.dev`).
    *   You can also set up a custom domain in the "Custom domains" section of your Cloudflare Pages project.

## 4. Post-Deployment Tasks

*   **Monitor performance:** Check the Cloudflare Pages dashboard for performance insights and analytics.
*   **Set up analytics:** Integrate analytics tools (e.g., Google Analytics, Cloudflare Web Analytics) to track user engagement.
*   **Update and maintain:** To deploy updates, simply commit and push changes to your connected GitHub repository. Cloudflare Pages will automatically redeploy your PWA.

## 5. Rollback Plan

*   Cloudflare Pages automatically versions deployments. You can easily roll back to a previous deployment from the Cloudflare Pages dashboard if needed.
*   In the "Deployments" section, select a previous deployment and click "Rollback to this deployment."

## 6. Troubleshooting

*   **Deployment failures:**
    *   Check the "Deployment logs" in Cloudflare Pages for detailed build and deployment errors.
    *   Ensure your build command and output directory are correctly configured.
    *   Verify that `package.json` and `package-lock.json` are present and correct.
*   **PWA not working as expected:**
    *   Clear browser cache and service worker cache on your testing devices.
    *   Check the browser's developer console for JavaScript errors or service worker issues.
    *   Ensure `manifest.webmanifest` and `sw.js` are correctly linked in `index.html`.
*   **API errors:**
    *   Verify that Cloudflare Workers are correctly deployed and configured.
    *   Check Cloudflare Workers logs for API errors.
    *   Ensure environment variables (like `GEMINI_API_KEY`) are correctly set in Cloudflare Pages.

## 7. Cloudflare Workers Deployment (API Backend)

*   If you are using Cloudflare Workers for the API backend (as suggested for Texty), ensure you deploy your Cloudflare Workers separately.
*   Use `wrangler deploy` from the `workers/` directory (or root if your `wrangler.toml` is there) to deploy your worker functions.
*   Link the Cloudflare Workers URL to your PWA frontend in `script.js` or `auth.js`.