import { useState, useRef, useEffect } from 'react';
import './styles.css';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function EmojiPicker({ onCopy }) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
      const response = await fetch(URL+`/pick?prompt=${encodeURIComponent(prompt)}`, {
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
            placeholder="Describe the emoji you want"
            disabled={isLoading}
            autoFocus
          />
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