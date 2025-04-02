# User Manual: Texty - AI Text Enhancement PWA

## 1. Introduction

This user manual provides instructions on how to use Texty as a Progressive Web App (PWA) for text enhancement.

## 2. Installation (PWA)

1.  **Open Texty in your browser:** Navigate to https://texty-6dj.pages.dev/
2.  **Install the PWA:**
    *   **Desktop (Chrome, Edge, Firefox, Safari):** Look for an "Install" icon in the address bar (usually a "+" icon or a download icon). Click it and follow the prompts to install Texty as an application on your desktop.
    *   **Android (Chrome):** Chrome will prompt you to "Add Texty to Home screen" upon first visit or frequent use. Tap the prompt and then "Add." Alternatively, open the Chrome menu (three dots), and select "Add to Home screen."
    *   **iOS (Safari):** Open the Share sheet (square with arrow up) at the bottom of Safari, then select "Add to Home Screen." Tap "Add" in the top right corner.
3.  **Texty is now installed:** The Texty app icon will appear on your home screen or app launcher, ready to use offline and online.

## 3. Usage

1.  **Access Texty App:** Open the Texty app from your home screen or app launcher.
2.  **Enhancing Text:**
    *   Enter your text in the "Your Text" input area.
    *   Select your preferred AI model from the "Model" dropdown.
    *   Choose enhancement options by clicking the enhancement buttons (e.g., "Add Context," "Clarify").
    *   Tap or click the "Enhance Text" button.
    *   The enhanced text will appear in the "Enhanced Text" output area on the right.
3.  **Copy and Share Enhanced Text:**
    *   Click the "Copy" button to copy the enhanced text to your device's clipboard.
    *   Use the native Share API on mobile devices to share text directly to other apps.
    *   Receive shared text from other apps (Share Target API support).

## 4. Features

*   **AI-Powered Text Enhancement:** Utilize advanced AI models (Gemini 1.5 Flash, Gemini Pro, Gemini Pro Vision) to enhance your text.
*   **Multiple Enhancement Options:** Select from options like "Add Context," "Expand Details," "Clarify," "Professional Tone," and "Creative Flair."
*   **Cross-Device Accessibility:** Use Texty on any device with a modern web browser - desktop, mobile, and tablet.
*   **Offline Mode:** Access recently enhanced texts and perform basic enhancements even without an internet connection.
*   **PWA Features:**
    *   Install as native app
    *   Work offline
    *   Receive shared text from other apps
    *   Share enhanced text to other apps
    *   Background sync for offline operations
    *   Push notifications for important updates
*   **Responsive Design:** Mobile-optimized interface with touch support and safe area handling.
*   **Data Persistence:** IndexedDB storage for offline access to your enhanced texts.

## 5. Offline Mode

*   **Accessing Cached Texts:**
    *   All your recent text enhancements are automatically stored locally
    *   Access your history even without internet connection
    *   View and copy previously enhanced texts offline
*   **Offline Capabilities:**
    *   Create new text enhancements (queued for processing when online)
    *   Access all UI features and previously enhanced content
    *   Automatic background sync when connection is restored
*   **Storage Management:**
    *   Texty automatically manages local storage
    *   Important data is preserved even with limited storage
    *   Option to clear cached data manually if needed

## 6. Troubleshooting

*   **PWA Installation Issues:**
    *   Ensure you are using a compatible browser (Chrome, Safari, Firefox, Edge).
    *   Check your browser settings to allow PWA installations.
    *   For iOS, ensure you are using Safari and not in Private Browsing mode.
*   **Offline Mode Issues:**
    *   If offline features aren't working, try:
        *   Refreshing the app
        *   Checking if service worker is active
        *   Reinstalling the PWA
*   **General Issues:**
    *   Check your internet connection for online features
    *   Ensure JavaScript is enabled in your browser
    *   Clear browser cache and service worker if experiencing problems
    *   Check browser console for any error messages

## 7. Support

For support, feedback, or bug reports:
*   Visit our GitHub repository: https://github.com/Shawn5cents/Texty
*   File issues for bugs or feature requests
*   Contact the development team through GitHub