'use client';

import { useState } from 'react';

const quickLinks = ['Weather', 'News', 'Images', 'Videos', 'Maps'];

function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [answer, setAnswer] = useState('');
  const [answerUrl, setAnswerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchTerm = query.trim();

    if (!searchTerm) {
      setError('Please enter a search term.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.results || []);
      setAnswer(data.answer || '');
      setAnswerUrl(data.answerUrl || '');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setResults([]);
      setAnswer('');
      setAnswerUrl('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <header className="topbar">
        <nav className="nav-links">
          <a href="#">Gmail</a>
          <a href="#">Images</a>
          <button className="apps-button" aria-label="Google apps">⋮</button>
          <button className="sign-in">Sign in</button>
        </nav>
      </header>

      <section className="hero">
        <div className="logo" aria-label="Google">
          <span className="red">G</span>
          <span className="blue">o</span>
          <span className="yellow">o</span>
          <span className="red">g</span>
          <span className="green">l</span>
          <span className="blue">e</span>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search"
              placeholder="Search the web"
            />
            <span className="mic-icon">🎤</span>
            <span className="lens-icon">⌕</span>
          </div>

          <div className="search-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Searching…' : 'Google Search'}
            </button>
            <button type="button">I&apos;m Feeling Lucky</button>
          </div>
        </form>

        <div className="quick-links">
          {quickLinks.map((link) => (
            <button key={link} type="button" className="quick-link">
              {link}
            </button>
          ))}
        </div>
      </section>

      <section className="results-panel">
        {error && <div className="error-box">{error}</div>}

        {answer && (
          <article className="answer-box">
            <div className="answer-label">Answer</div>
            <h2>{stripHtml(answer)}</h2>
            {answerUrl && (
              <a href={answerUrl} target="_blank" rel="noreferrer">
                {answerUrl}
              </a>
            )}
          </article>
        )}

        {results.length > 0 && (
          <div className="results-list">
            {results.map((item, index) => (
              <article className="result-item" key={`${item.url}-${index}`}>
                <div className="result-url">{item.url}</div>
                <a href={item.url} target="_blank" rel="noreferrer" className="result-title">
                  {item.title}
                </a>
                <p>{item.snippet}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
