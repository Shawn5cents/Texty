// Content script to add text enhancement to any text field

// Create enhancement menu element
function createEnhancementMenu() {
    const menu = document.createElement('div');
    menu.id = 'texty-enhancement-menu';
    menu.style.cssText = `
        position: absolute;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        padding: 8px;
        z-index: 10000;
        display: none;
    `;

    const options = [
        { id: 'add-context', text: 'Add Context' },
        { id: 'expand-details', text: 'Expand Details' },
        { id: 'clarify', text: 'Clarify' },
        { id: 'professional', text: 'Professional Tone' },
        { id: 'creative', text: 'Creative Flair' }
    ];

    options.forEach(option => {
        const button = document.createElement('button');
        button.id = `texty-${option.id}`;
        button.textContent = option.text;
        button.style.cssText = `
            display: block;
            width: 100%;
            padding: 4px 8px;
            margin: 2px 0;
            border: none;
            background: #f3e8ff;
            color: #6b21a8;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            text-align: left;
        `;
        button.onmouseover = () => button.style.background = '#e9d5ff';
        button.onmouseout = () => button.style.background = '#f3e8ff';
        menu.appendChild(button);
    });

    document.body.appendChild(menu);
    return menu;
}

// Show enhancement menu at position
function showEnhancementMenu(x, y) {
    const menu = document.getElementById('texty-enhancement-menu') || createEnhancementMenu();
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = 'block';
}

// Hide enhancement menu
function hideEnhancementMenu() {
    const menu = document.getElementById('texty-enhancement-menu');
    if (menu) menu.style.display = 'none';
}

// Handle text enhancement
async function enhanceText(text, option) {
    try {
        // Use the enhanceTextWithAuth function from auth.js
        const enhancedText = await window.enhanceTextWithAuth(text, [option]);
        return enhancedText;
    } catch (error) {
        console.error('Error enhancing text:', error);
        showError(error.message || 'Failed to enhance text');
        return text;
    }
}

// Initialize enhancement functionality
function initTextEnhancement() {
    // Handle right-click on text fields
    document.addEventListener('contextmenu', (e) => {
        const target = e.target;
        if (target.matches('input[type="text"], textarea')) {
            e.preventDefault();
            showEnhancementMenu(e.pageX, e.pageY);
        }
    });

    // Handle enhancement option selection
    document.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.closest('#texty-enhancement-menu')) {
            const option = target.id.replace('texty-', '');
            const activeElement = document.activeElement;
            
            if (activeElement.matches('input[type="text"], textarea')) {
                const originalText = activeElement.value;
                const enhancedText = await enhanceText(originalText, option);
                activeElement.value = enhancedText;
            }
            
            hideEnhancementMenu();
        } else {
            hideEnhancementMenu();
        }
    });
}

// Start the enhancement functionality
initTextEnhancement();