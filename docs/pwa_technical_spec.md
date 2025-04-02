# PWA Technical Specification: Texty - Text Enhancement Application

## 1. Required Files

### New Files to Create
```
📁 project_root/
├── manifest.webmanifest         # PWA manifest
├── sw.js                       # Service Worker
├── api/                        # Cloudflare Workers
│   ├── enhance-text.js         # Text enhancement endpoint
│   └── auth.js                 # Authentication handler
├── js/
│   ├── pwa.js                 # PWA registration and features
│   └── mobile-api.js          # Mobile API integrations
└── workers/
    └── wrangler.toml          # Cloudflare Workers config
```

## 2. File Specifications

### manifest.webmanifest
```json
{
  "name": "Texty - Text Enhancement",
  "short_name": "Texty",
  "description": "AI-powered text enhancement for any device",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#7c3aed",
  "icons": [
    {
      "src": "icon48.svg",
      "sizes": "48x48",
      "type": "image/svg+xml"
    },
    {
      "src": "icon128.svg",
      "sizes": "128x128",
      "type": "image/svg+xml"
    },
    {
      "src": "icon512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "share_target": {
    "action": "/enhance",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  }
}
```

### Service Worker (sw.js)
```javascript
const CACHE_NAME = 'texty-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache
const CACHE_FILES = [
  '/',
  '/index.html',
  '/dist/output.css',
  '/js/pwa.js',
  '/js/mobile-api.js',
  '/js/script.js',
  '/offline.html',
  '/icon48.svg',
  '/icon128.svg'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_FILES))
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  // Handle API requests
  if (event.request.url.includes('/api/')) {
    // Network first, then offline fallback
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Cache first for static assets
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Handle share target
self.addEventListener('fetch', event => {
  if (event.request.url.endsWith('/enhance')) {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const text = formData.get('text') || '';
      return Response.redirect('/?text=' + encodeURIComponent(text));
    })());
  }
});
```

### Mobile API Integration (mobile-api.js)
```javascript
class MobileAPI {
  // Check if share API is supported
  static isShareSupported() {
    return navigator.share !== undefined;
  }

  // Share enhanced text
  static async shareText(text) {
    if (!this.isShareSupported()) {
      throw new Error('Share API not supported');
    }

    try {
      await navigator.share({
        title: 'Enhanced Text',
        text: text
      });
    } catch (error) {
      console.error('Error sharing:', error);
      throw error;
    }
  }

  // Request clipboard permissions
  static async requestClipboardPermission() {
    try {
      const result = await navigator.permissions.query({
        name: 'clipboard-write'
      });
      return result.state === 'granted';
    } catch (error) {
      console.error('Clipboard permission error:', error);
      return false;
    }
  }

  // Copy to clipboard
  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Clipboard error:', error);
      return false;
    }
  }

  // Handle file system access
  static async getFileHandle() {
    try {
      return await window.showSaveFilePicker({
        suggestedName: 'enhanced-text.txt',
        types: [{
          description: 'Text Files',
          accept: {
            'text/plain': ['.txt'],
          },
        }],
      });
    } catch (error) {
      console.error('File system error:', error);
      throw error;
    }
  }
}

export default MobileAPI;
```

### Cloudflare Worker (api/enhance-text.js)
```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // Verify method
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not allowed'
    }), {
      status: 405,
      headers
    });
  }

  try {
    const body = await request.json();
    const { text, options, model } = body;

    // Rate limiting check
    const ip = request.headers.get('CF-Connecting-IP');
    const rateLimitOK = await checkRateLimit(ip);
    if (!rateLimitOK) {
      throw new Error('Rate limit exceeded');
    }

    // Call Gemini API
    const enhancedText = await enhanceText(text, options, model);

    return new Response(JSON.stringify({
      success: true,
      enhancedText
    }), { headers });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers
    });
  }
}
```

## 3. Required Changes to Existing Files

### index.html
- Add manifest link
- Add meta tags for PWA
- Add service worker registration
- Update UI for mobile-first design

### script.js
- Update API endpoint to use Cloudflare Worker
- Add mobile API integration
- Add offline support handling
- Add share target handling

### auth.js
- Move API key to Cloudflare Workers
- Update authentication flow
- Add session management

## 4. Cloudflare Setup

### Pages Configuration
```toml
# Configuration for Cloudflare Pages
[build]
command = "npm run build"
publish = "/"
```

### Workers Configuration (wrangler.toml)
```toml
name = "texty-api"
type = "javascript"
account_id = "your-account-id"
workers_dev = true

[env.production]
route = "api.texty.app/*"
zone_id = "your-zone-id"

[env.production.vars]
GEMINI_API_KEY = "your-api-key"
```

## 5. Implementation Steps

1. Create PWA Infrastructure
   - Add manifest.webmanifest
   - Create service worker
   - Update HTML meta tags
   - Add mobile API integration

2. Set Up Cloudflare
   - Configure Cloudflare Pages
   - Create Cloudflare Workers
   - Set up environment variables
   - Configure custom domain

3. Update Application Code
   - Modify API calls
   - Add offline support
   - Implement share target
   - Add mobile optimizations

4. Testing
   - Test PWA installation
   - Verify offline functionality
   - Test mobile integration
   - Validate API endpoints

Would you like to proceed with implementing any specific part of this technical specification?