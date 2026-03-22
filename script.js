class WordPicker {
    constructor() {
        this.words = [];
        this.remainingWords = [];
        this.currentWord = null;
        this.isSubmitted = false;
        this.wordCount = 10;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkSpeechSynthesis();
    }

    checkSpeechSynthesis() {
        const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;
        const speechSynthesis = window.speechSynthesis || window.webkitSpeechSynthesis;
        
        if (!SpeechSynthesisUtterance || !speechSynthesis) {
            console.warn('Speech synthesis not supported in this browser');
        }
    }

    setupEventListeners() {
        const setupBtn = document.getElementById('setupBtn');
        const submitBtn = document.getElementById('submitBtn');
        const pickBtn = document.getElementById('pickBtn');
        const readWordBtn = document.getElementById('readWordBtn');
        const backBtn = document.getElementById('backBtn');
        const restartBtn = document.getElementById('restartBtn');
        const backToSetupBtn = document.getElementById('backToSetupBtn');
        const wordCountInput = document.getElementById('wordCount');

        setupBtn.addEventListener('click', () => this.setupWordCount());
        wordCountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setupWordCount();
            }
        });
        submitBtn.addEventListener('click', () => this.submitWords());
        pickBtn.addEventListener('click', () => this.pickWord());
        readWordBtn.addEventListener('click', () => this.readWordAloud());
        backBtn.addEventListener('click', () => this.goBack());
        restartBtn.addEventListener('click', () => this.restart());
        backToSetupBtn.addEventListener('click', () => this.goBackToSetup());
    }

    setupWordCount() {
        const wordCountInput = document.getElementById('wordCount');
        const count = parseInt(wordCountInput.value, 10);

        if (isNaN(count) || count < 1 || count > 100) {
            this.showMessage('Please enter a number between 1 and 100.', 'error', 'setupPage');
            return;
        }

        this.wordCount = count;
        this.generateWordInputs();
        this.switchToInputPage();
        this.clearMessage('setupPage');
    }

    generateWordInputs() {
        const grid = document.getElementById('wordsInputGrid');
        grid.innerHTML = '';

        for (let i = 1; i <= this.wordCount; i++) {
            const group = document.createElement('div');
            group.className = 'word-input-group';

            const label = document.createElement('label');
            label.htmlFor = `word${i}`;
            label.textContent = `Word ${i}`;

            const input = document.createElement('input');
            input.type = 'text';
            input.id = `word${i}`;
            input.placeholder = 'Enter word';
            input.maxLength = '50';

            group.appendChild(label);
            group.appendChild(input);
            grid.appendChild(group);
        }

        // Update subtitle
        const subtitle = document.getElementById('inputSubtitle');
        subtitle.textContent = `Enter ${this.wordCount} word${this.wordCount !== 1 ? 's' : ''}`;
    }

    getInputWords() {
        const words = [];
        for (let i = 1; i <= this.wordCount; i++) {
            const input = document.getElementById(`word${i}`);
            const word = input.value.trim();
            if (word.length > 0) {
                words.push(word);
            }
        }
        return words;
    }

    submitWords() {
        const words = this.getInputWords();

        // Validation
        if (words.length === 0) {
            this.showMessage(`Please enter at least one word.`, 'error', 'inputPage');
            return;
        }

        if (words.length < this.wordCount) {
            this.showMessage(
                `You've entered ${words.length} word(s). Please enter ${this.wordCount} words.`,
                'error',
                'inputPage'
            );
            return;
        }

        // Check for duplicates
        const uniqueWords = new Set(words.map(w => w.toLowerCase()));
        if (uniqueWords.size !== words.length) {
            this.showMessage('Please ensure all words are unique (case-insensitive).', 'error', 'inputPage');
            return;
        }

        this.words = words;
        this.remainingWords = [...words];
        this.isSubmitted = true;

        // Disable inputs
        this.disableInputs();

        // Switch to picker page
        this.switchToPickerPage();

        // Pick the first word automatically
        this.pickWord();
    }

    disableInputs() {
        for (let i = 1; i <= this.wordCount; i++) {
            const input = document.getElementById(`word${i}`);
            if (input) {
                input.disabled = true;
            }
        }
    }

    enableInputs() {
        for (let i = 1; i <= this.wordCount; i++) {
            const input = document.getElementById(`word${i}`);
            if (input) {
                input.disabled = false;
            }
        }
    }

    switchToInputPage() {
        document.getElementById('setupPage').style.display = 'none';
        document.getElementById('inputPage').style.display = 'block';
    }

    switchToPickerPage() {
        document.getElementById('inputPage').style.display = 'none';
        document.getElementById('pickerPage').style.display = 'block';
    }

    switchToSetupPage() {
        document.getElementById('inputPage').style.display = 'none';
        document.getElementById('pickerPage').style.display = 'none';
        document.getElementById('setupPage').style.display = 'block';
    }

    pickWord() {
        if (this.remainingWords.length === 0) {
            const wordLabel = this.wordCount === 1 ? 'word' : 'words';
            this.showMessage(`All ${this.wordCount} ${wordLabel} have been picked! Click "Back" to start again.`, 'complete', 'pickerPage');
            document.getElementById('pickBtn').disabled = true;
            document.getElementById('readWordBtn').disabled = true;
            return;
        }

        // Pick a random word
        const randomIndex = Math.floor(Math.random() * this.remainingWords.length);
        this.currentWord = this.remainingWords[randomIndex];

        // Remove from remaining words
        this.remainingWords.splice(randomIndex, 1);

        // Update remaining count
        this.updateRemainingCount();

        // Clear message
        this.clearMessage('pickerPage');

        // Show notification
        if (this.remainingWords.length === 0) {
            setTimeout(() => {
                this.showMessage('Last word! All words will be done after this one.', 'info', 'pickerPage');
            }, 300);
        }
    }

    detectLanguage(text) {
        // Chinese characters (Simplified and Traditional)
        const chineseRegex = /[\u4E00-\u9FFF\u3400-\u4DBF]/g;
        // Japanese Hiragana, Katakana, Kanji
        const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g;
        // Korean Hangul
        const koreanRegex = /[\uAC00-\uD7AF]/g;
        // Arabic
        const arabicRegex = /[\u0600-\u06FF]/g;

        if (chineseRegex.test(text)) {
            return 'zh-CN'; // Simplified Chinese
        } else if (japaneseRegex.test(text)) {
            return 'ja-JP';
        } else if (koreanRegex.test(text)) {
            return 'ko-KR';
        } else if (arabicRegex.test(text)) {
            return 'ar-SA';
        }
        return 'en-US'; // Default to English
    }

    getVoiceForLanguage(speechSynthesis, lang) {
        const voices = speechSynthesis.getVoices();
        
        // Try to find a voice that matches the language
        let selectedVoice = voices.find(v => v.lang.startsWith(lang.substring(0, 2)));
        
        // If no match, return the first available voice (browser will auto-select)
        return selectedVoice || null;
    }

    readWordAloud() {
        if (!this.currentWord) {
            this.showMessage('Please pick a word first.', 'error', 'pickerPage');
            return;
        }

        const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;
        const speechSynthesis = window.speechSynthesis || window.webkitSpeechSynthesis;

        if (!SpeechSynthesisUtterance || !speechSynthesis) {
            this.showMessage('Speech synthesis not supported in your browser.', 'error', 'pickerPage');
            return;
        }

        // Stop any ongoing speech
        speechSynthesis.cancel();

        // Detect language
        const lang = this.detectLanguage(this.currentWord);

        // Create utterance with multi-language support
        const utterance = new SpeechSynthesisUtterance(this.currentWord);
        utterance.lang = lang;
        utterance.rate = 0.9; // Slightly slower speech for clarity
        utterance.pitch = 1;
        utterance.volume = 1;

        // Add error handling
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.showMessage(`Could not read word: ${event.error}`, 'error', 'pickerPage');
        };

        utterance.onstart = () => {
            const readBtn = document.getElementById('readWordBtn');
            if (readBtn) {
                readBtn.textContent = '🔊 Reading...';
            }
        };

        utterance.onend = () => {
            const readBtn = document.getElementById('readWordBtn');
            if (readBtn) {
                readBtn.innerHTML = '<span class="button-icon">🔊</span> Read Word';
            }
        };

        try {
            // Set voice if available
            const voice = this.getVoiceForLanguage(speechSynthesis, lang);
            if (voice) {
                utterance.voice = voice;
            }

            // Ensure voices are loaded before speaking
            if (speechSynthesis.getVoices().length === 0) {
                speechSynthesis.onvoiceschanged = () => {
                    const voiceToUse = this.getVoiceForLanguage(speechSynthesis, lang);
                    if (voiceToUse) {
                        utterance.voice = voiceToUse;
                    }
                    speechSynthesis.speak(utterance);
                };
            } else {
                speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error('Error speaking:', error);
            this.showMessage('Error reading word. Please try again.', 'error', 'pickerPage');
        }
    }

    updateRemainingCount() {
        const remaining = this.remainingWords.length;
        document.getElementById('wordsRemaining').textContent = 
            `Words remaining: ${remaining} / ${this.words.length}`;
    }

    goBack() {
        // Stop any ongoing speech
        const speechSynthesis = window.speechSynthesis || window.webkitSpeechSynthesis;
        if (speechSynthesis) {
            speechSynthesis.cancel();
        }

        // Reset state but keep the words
        this.currentWord = null;
        this.remainingWords = [...this.words]; // Restore the list

        // Switch back to input page
        document.getElementById('pickerPage').style.display = 'none';
        document.getElementById('inputPage').style.display = 'block';

        // Reset button states
        document.getElementById('pickBtn').disabled = false;
        document.getElementById('readWordBtn').disabled = false;

        // Clear message
        this.clearMessage('pickerPage');
    }

    restart() {
        // Stop any ongoing speech
        const speechSynthesis = window.speechSynthesis || window.webkitSpeechSynthesis;
        if (speechSynthesis) {
            speechSynthesis.cancel();
        }

        // Clear all inputs
        for (let i = 1; i <= this.wordCount; i++) {
            const input = document.getElementById(`word${i}`);
            if (input) {
                input.value = '';
            }
        }

        // Reset state
        this.words = [];
        this.remainingWords = [];
        this.currentWord = null;
        this.isSubmitted = false;

        // Enable inputs
        this.enableInputs();

        // Switch back to input page
        document.getElementById('pickerPage').style.display = 'none';
        document.getElementById('inputPage').style.display = 'block';

        // Reset button states
        document.getElementById('pickBtn').disabled = false;
        document.getElementById('readWordBtn').disabled = false;

        // Clear messages
        this.clearMessage('inputPage');
        this.clearMessage('pickerPage');
    }

    goBackToSetup() {
        // Stop any ongoing speech
        const speechSynthesis = window.speechSynthesis || window.webkitSpeechSynthesis;
        if (speechSynthesis) {
            speechSynthesis.cancel();
        }

        // Clear all inputs
        for (let i = 1; i <= this.wordCount; i++) {
            const input = document.getElementById(`word${i}`);
            if (input) {
                input.value = '';
            }
        }

        // Reset state
        this.words = [];
        this.remainingWords = [];
        this.currentWord = null;
        this.isSubmitted = false;

        // Enable inputs
        this.enableInputs();

        // Switch back to setup page
        this.switchToSetupPage();

        // Reset button states
        document.getElementById('pickBtn').disabled = false;
        document.getElementById('readWordBtn').disabled = false;

        // Clear messages
        this.clearMessage('setupPage');
        this.clearMessage('inputPage');
        this.clearMessage('pickerPage');
    }

    showMessage(text, type, pageId) {
        const messageMap = {
            'setupPage': 'setupMessage',
            'inputPage': 'message',
            'pickerPage': 'pickerMessage'
        };
        const messageId = messageMap[pageId] || 'message';
        const messageEl = document.getElementById(messageId);
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = `message ${type}`;
        }
    }

    clearMessage(pageId) {
        const messageMap = {
            'setupPage': 'setupMessage',
            'inputPage': 'message',
            'pickerPage': 'pickerMessage'
        };
        const messageId = messageMap[pageId] || 'message';
        const messageEl = document.getElementById(messageId);
        if (messageEl) {
            messageEl.textContent = '';
            messageEl.className = 'message';
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WordPicker();
});
