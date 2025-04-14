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
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;