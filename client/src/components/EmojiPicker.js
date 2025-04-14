import { useState, useRef, useEffect } from 'react';
import './styles.css';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function EmojiPicker({ onCopy }) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emojiCount, setEmojiCount] = useState("3");
  const textareaRef = useRef(null);

  const selectTextareaContent = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  };

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        selectTextareaContent();
      }, 100);
    }
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(URL+`/pick?prompt=${encodeURIComponent(prompt)}&count=${emojiCount}`, {
        headers: {
          'Authorization': token
        }
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.completion);
        copyToClipboard(data.completion);
      } else {
        setError(data.error || 'Failed to get emojis');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      onCopy();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="emoji-picker container">
      <h2>Emoji Picker</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            ref={textareaRef}
            className="input textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the emoji you want (Press Enter to submit, Shift+Enter for new line)"
            disabled={isLoading}
            autoFocus
          />
          <div className="count-selector">
            <label>
              <input
                type="radio"
                value="1"
                checked={emojiCount === '1'}
                onChange={(e) => setEmojiCount(e.target.value)}
              />
              1 emoji
            </label>
            <label>
              <input
                type="radio"
                value="3"
                checked={emojiCount === '3'}
                onChange={(e) => setEmojiCount(e.target.value)}
              />
              3 emojis
            </label>
            <label>
              <input
                type="radio"
                value="auto"
                checked={emojiCount === 'auto'}
                onChange={(e) => setEmojiCount(e.target.value)}
              />
              Auto
            </label>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="button" disabled={isLoading}>
          {isLoading ? <div className="loading-dots"><span>.</span><span>.</span><span>.</span></div> : 'Get Emojis'}
        </button>
      </form>
      
      {result && (
        <div className="result">
          <div className="emoji-result">{result}</div>
          <button 
            className="button copy-button"
            onClick={() => {
              copyToClipboard(result);
            }}
          >
            <svg x="0px" y="0px" width="20px" height="24px" style={{transform: "translateY(2px)"}} viewBox="0 0 115.77 122.88"><g><path d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"/></g></svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;