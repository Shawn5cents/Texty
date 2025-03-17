// Texty API integration with API key
let apiKey = 'AIzaSyDMsYnlVhNuFsmjPgC4FerhxSAEAIh6_Mw';

// Save credentials
function saveCredentials(key, model) {
    if (key) localStorage.setItem('textyApiKey', key);
    if (model) localStorage.setItem('selectedModel', model);
}

// Load saved credentials
function loadSavedCredentials() {
    const savedApiKey = localStorage.getItem('textyApiKey');
    const savedModel = localStorage.getItem('selectedModel');
    const modelSelect = document.getElementById('model-select');
    
    if (savedApiKey) {
        apiKey = savedApiKey;
    } else {
        saveCredentials(apiKey, null);
    }
    
    if (savedModel && modelSelect) {
        modelSelect.value = savedModel;
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    } else {
        console.error('Error:', message);
    }
}

// Enhanced text function using Texty API with API key
async function enhanceTextWithAuth(text, options) {
    if (!apiKey || apiKey.trim() === '') {
        throw new Error('Please enter your Texty API key.');
    }

    const selectedModel = document.getElementById('model-select')?.value || 'texty-standard';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;
    
    let prompt = "Enhance the following text";
    
    if (options.includes('add-context')) {
        prompt += ", add more contextual information";
    }
    if (options.includes('expand-details')) {
        prompt += ", expand on details and examples";
    }
    if (options.includes('clarify')) {
        prompt += ", clarify any ambiguous points";
    }
    if (options.includes('professional')) {
        prompt += ", use a professional and formal tone";
    }
    if (options.includes('creative')) {
        prompt += ", add creative and engaging elements";
    }
    
    prompt += ". Preserve the original meaning and intent. Format the response in markdown.\n\nText to enhance:\n" + text;

    const requestBody = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ]
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error('Unexpected API response format');
    }
}

// Load saved credentials when the page loads
document.addEventListener('DOMContentLoaded', loadSavedCredentials);

// Export functions for use in main script and content script
window.enhanceTextWithAuth = enhanceTextWithAuth;
window.showError = showError;

// Export as module for content script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        enhanceTextWithAuth,
        showError
    };
}