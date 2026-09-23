'use client';

import { useState } from 'react';

const quickLinks = ['Weather', 'News', 'Images', 'Videos', 'Maps'];

function flattenTopics(topics = []) {
  return topics.flatMap((topic) => (topic.Topics ? flattenTopics(topic.Topics) : [topic]));
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
    setResults([]);
    setAnswer('');
    setAnswerUrl('');

    try {
      const endpoint = `https://api.duckduckgo.com/?q=${encodeURIComponent(searchTerm)}&format=json&no_html=1&skip_disambig=1`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('The search service is unavailable.');

      const data = await response.json();
      const topics = flattenTopics(data.RelatedTopics || [])
        .filter((item) => item.Text && item.FirstURL)
        .slice(0, 12)
        .map((item) => ({
          title: item.Text.split(' - ')[0],
          snippet: item.Text,
          url: item.FirstURL,
        }));

      setAnswer(data.AbstractText || '');
      setAnswerUrl(data.AbstractURL || '');
      setResults(topics);

      if (!data.AbstractText && topics.length === 0) {
        setError('No instant results were found. Try a more specific search.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while searching.');
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
              onChange={(event) => setQuery(event.target.value)}
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
            <button
              type="button"
              onClick={() =>
                query &&
                window.open(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, '_blank')
              }
            >
              I&apos;m Feeling Lucky
            </button>
          </div>
        </form>

        <div className="quick-links">
          {quickLinks.map((link) => (
            <button key={link} type="button" className="quick-link" onClick={() => setQuery(link)}>
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
            <h2>{answer}</h2>
            {answerUrl && (
              <a href={answerUrl} target="_blank" rel="noreferrer">
                Read more
              </a>
            )}
          </article>
        )}
        {results.length > 0 && (
          <div className="results-list">
            {results.map((item, index) => (
              <article className="result-item" key={`${item.url}-${index}`}>
                <div className=\"result-url\">{item.url}</div>
                <a href={item.url} target=\"_blank\" rel=\"noreferrer\" className=\"result-title\">
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
