# Design Document: Texty - AI Text Enhancement PWA

## 1. Introduction

This document describes the design of the Texty Progressive Web App (PWA), including the architecture, data model, and UI/UX specifications.

## 2. Architecture

The Texty PWA adopts a modern web architecture, leveraging service workers for offline capabilities and Cloudflare Pages for hosting. The main components are:

*   **UI (index.html, script.js):** The user interface is built using HTML, CSS (Tailwind CSS), and JavaScript, optimized for both desktop and mobile.
*   **Service Worker (sw.js):** Handles caching of static assets, offline functionality, and background sync.
*   **Cloudflare Pages:** Hosts the PWA and serves static assets via CDN.
*   **Cloudflare Workers (api/):** Manages API requests, including text enhancement calls to the Gemini API.
*   **API Key Security:** The API key is stored in the frontend (`auth.js`) and passed with each request to the Gemini API. While this approach simplifies the setup, it's important to acknowledge the security considerations of exposing the API key in the frontend. For enhanced security in production environments, consider backend API key management and proxying API requests through a server.
*   **IndexedDB:** For local storage of enhanced texts, enabling offline access.

## 3. Data Model

The PWA uses the following data structures:

*   **EnhancedTextEntry:**
    *   `id` (integer, auto-incrementing key): Unique ID for each enhanced text entry.
    *   `originalText` (string): The user's original input text.
    *   `enhancedText` (string): The AI-enhanced text output.
    *   `options` (array of strings): List of enhancement options used.
    *   `timestamp` (string, ISO timestamp): Date and time when the text was enhanced.

## 4. UI/UX Specifications

The UI is designed to be responsive and user-friendly across devices. Key elements include:

*   **Input Area:** A text area for users to input text for enhancement.
*   **Enhancement Options:** A selection of buttons for enhancement types (Add Context, Expand Details, Clarify, Professional Tone, Creative Tone).
*   **Model Selection:** Dropdown to choose between Gemini AI models (currently supports `gemini-1.0-pro-latest`).
*   **Enhance Button:** Triggers the text enhancement process.
*   **Output Area:** Displays the enhanced text, formatted in Markdown.
*   **Copy Button:** Copies the enhanced text to the clipboard.
*   **Share Button (Mobile):** Uses the Web Share API to share text on mobile devices.
*   **API Key Storage:**  The API key is stored locally in the browser's localStorage for persistent access.
*   **Offline Indicator:** Visual cue to indicate offline status.
*   **Install Banner:** Prompts users to install the PWA.
*   **Offline Page (offline.html):** Displays cached texts and offline features when offline.

## 5. Diagrams

### 5.1. Architectural Diagram

```mermaid
graph LR
    A[User Device (Browser)] --> B{PWA Client (index.html, script.js)}
    B --> C[Service Worker (sw.js)]
    C --> D[Cache Storage (Browser)]
    B --> E[Cloudflare Pages (CDN)]
    E --> F[Cloudflare Workers (api/enhance-text.js)]
    F --> G[Gemini API]
    B --> H[IndexedDB (Browser)]

    style B fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#ccf,stroke:#333,stroke-width:2px
    style F fill:#ccf,stroke:#333,stroke-width:2px
```

### 5.2. Data Model Diagram

```
EnhancedTextEntry {
  id: integer (auto-increment)
  originalText: string
  enhancedText: string
  options: string[]
  timestamp: string (ISO)
}