// IndexedDB setup for offline storage
const dbName = 'texty-offline';
const storeName = 'enhanced-texts';
let db;

// Open IndexedDB
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            }
        };
    });
};

// Save enhanced text to IndexedDB
const saveToOfflineStorage = async (originalText, enhancedText, options) => {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    await store.add({
        originalText,
        enhancedText,
        options,
        timestamp: new Date().toISOString()
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    const enhanceButton = document.getElementById('enhance-button');
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const modelSelect = document.getElementById('model-select');
    const copyButton = document.getElementById('copy-button');
    const loadingSpinner = document.getElementById('loading-spinner');
    const enhancementOptions = document.querySelectorAll('.enhancement-option');
    
    let selectedOptions = [];

    // Initialize IndexedDB
    try {
        await openDB();
    } catch (error) {
        console.error('Failed to initialize IndexedDB:', error);
    }

    // Check for shared text
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('text')) {
        inputText.value = urlParams.get('text');
    }
    
    // Handle enhancement option selection
    enhancementOptions.forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('bg-purple-100');
            option.classList.toggle('bg-purple-500');
            option.classList.toggle('text-purple-800');
            option.classList.toggle('text-white');
            
            const optionValue = option.getAttribute('data-option');
            if (selectedOptions.includes(optionValue)) {
                selectedOptions = selectedOptions.filter(item => item !== optionValue);
            } else {
                selectedOptions.push(optionValue);
            }
        });
    });

    // Add share button if Web Share API is available
    if (navigator.share) {
        const shareButton = document.createElement('button');
        shareButton.className = 'text-sm text-purple-600 hover:text-purple-800 ml-4';
        shareButton.textContent = 'Share';
        copyButton.parentNode.appendChild(shareButton);

        shareButton.addEventListener('click', async () => {
            try {
                await navigator.share({
                    title: 'Enhanced Text from Texty',
                    text: outputText.textContent
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        });
    }
    
    // Handle copy button
    copyButton.addEventListener('click', async () => {
        const textToCopy = outputText.textContent;
        try {
            await navigator.clipboard.writeText(textToCopy);
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback to older clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            } catch (err) {
                console.error('Fallback copy failed:', err);
            }
            document.body.removeChild(textarea);
        }
    });
    
    // Handle enhance button
    enhanceButton.addEventListener('click', async () => {
        const text = inputText.value.trim();
        
        if (!text) {
            alert('Please enter some text to enhance');
            return;
        }
        
        // Show loading state
        loadingSpinner.classList.remove('hidden');
        enhanceButton.disabled = true;
        outputText.innerHTML = '<p class="text-gray-500">Enhancing your text...</p>';
        
        try {
            let enhancedText;
            
            if (navigator.onLine) {
                // Online: Use API
                enhancedText = await enhanceTextWithAuth(text, selectedOptions);
                
                // Save to offline storage
                try {
                    await saveToOfflineStorage(text, enhancedText, selectedOptions);
                } catch (storageError) {
                    console.error('Failed to save to offline storage:', storageError);
                }
            } else {
                // Offline: Check storage for similar text
                const db = await openDB();
                const tx = db.transaction(storeName, 'readonly');
                const store = tx.objectStore(storeName);
                const allItems = await store.getAll();
                
                // Find most similar stored text
                const similarItem = allItems.find(item => 
                    item.originalText.toLowerCase().includes(text.toLowerCase()) ||
                    text.toLowerCase().includes(item.originalText.toLowerCase())
                );
                
                if (similarItem) {
                    enhancedText = similarItem.enhancedText;
                } else {
                    throw new Error('No internet connection and no similar stored texts found.');
                }
            }
            
            outputText.innerHTML = marked.parse(enhancedText);
            
            // Register for background sync if offline
            if (!navigator.onLine && 'serviceWorker' in navigator && 'SyncManager' in window) {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register('enhance-text');
            }
        } catch (error) {
            console.error('Error enhancing text:', error);
            showError(error.message || 'Failed to enhance text. Please try again.');
            outputText.innerHTML = `<p class="text-red-500">Error: ${error.message || 'Failed to enhance text. Please try again.'}</p>`;
        } finally {
            // Hide loading state
            loadingSpinner.classList.add('hidden');
            enhanceButton.disabled = false;
        }
    });
    
    // Handle online/offline status
    window.addEventListener('online', () => {
        enhanceButton.textContent = 'Enhance Text';
        enhanceButton.disabled = false;
    });
    
    window.addEventListener('offline', () => {
        enhanceButton.textContent = 'Enhance Text (Offline)';
    });
});