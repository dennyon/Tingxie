# Word Picker Web Application

A simple and elegant web application that allows users to input 10 words in any language and randomly pick them one by one without repetition.

## Features

- **Flexible Word Count**: Choose how many words you want to learn (1-100 words)
- **Persistence via Cookie**: Word list and state are stored in cookies so refresh does not clear your current session
- **Multi-language Support**: Words can be in any language (Chinese, Spanish, French, Arabic, Hindi, Japanese, Korean, etc.)
- **Chinese Hanyu Pinyin**: If the current word contains Chinese characters, an optional pinyin transcription is displayed during audio playback
- **Audio-based Learning**: After submitting words, users are taken to a dedicated page for audio-only learning
- **Text-to-Speech**: Click the "🔊 Read Word" button to hear the word spoken aloud. The browser automatically detects and uses the appropriate voice for each language
- **Random Selection**: Pick words randomly from the list
- **No Repetition**: Once a word is picked, it won't be selected again until all words have been used
- **Visual Feedback**: Track how many words are remaining
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Input Validation**: Ensures all required words are filled and are unique
- **Easy Reset**: Clear all inputs and start over with a single click

## How to Use

1. **Choose Word Count**: Enter the number of words you want to learn (1-100)
2. **Enter Words**: Type your words into the input fields. Words can be in any language.
3. **Submit**: Click the "Submit Words" button to validate and save your word list.
4. **Pick Words**: Click "Pick Next Word" to randomly select a word from your list.
5. **Listen**: Click "🔊 Read Word" to hear the word spoken aloud in its appropriate language pronunciation.
6. **Repeat**: Continue clicking "Pick Next Word" to get more words (without seeing them displayed).
7. **Reset**: Click "Back" to return to the input page or "Back to Setup" to choose a different word count.

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and responsive design
- `script.js` - Application logic and interactivity

## Opening the Application

Simply open the `index.html` file in any modern web browser. No server or additional setup required.

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest versions)
- Firefox (latest versions)
- Safari (latest versions)
- Opera (latest versions)

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- No external dependencies required
- Fully responsive and mobile-friendly
- Uses CSS Grid and modern flexbox layouts
- Implements ES6 class-based architecture

## Customization

You can easily customize the application by modifying:
- Colors in `style.css` (gradient colors, button colors, etc.)
- The number of words by changing the grid generation logic in `script.js`
- Font families and sizes for different languages
