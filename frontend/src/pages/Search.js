import { useEffect, useState } from 'react';
import '../css/Search.css'; // 根据你的路径调整

function Search() {
  const [apods, setApods] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentApods = async () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 29);
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      try {
        const res = await fetch(`http://localhost:5000/api/apod-range?start_date=${startStr}&end_date=${endStr}`);
        const data = await res.json();
        const reversed = data.reverse();
        setApods(reversed);
        setFiltered(reversed);
      } catch (err) {
        console.error('Failed to fetch APOD data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentApods();
  }, []);

  const handleSearch = () => {
    const lowerKeyword = keyword.toLowerCase();
    const matched = apods.filter(item =>
      item.title && item.title.toLowerCase().includes(lowerKeyword)
    );
    setFiltered(matched);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-page">
      <h2>Search NASA APOD by Title</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter keyword (e.g. moon, galaxy)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="search-results">
        {loading ? (
          <div className="loading-spinner">
            <div className="css-spinner" />
            <p>Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <p>No results found.</p>
        ) : (
          filtered.map((item, idx) => (
            <div className="search-card" key={idx}>
              <div
                className="search-image"
                style={{ backgroundImage: `url(${item.url})` }}
              />
              <div className="search-info">
                <h3>{item.title}</h3>
                <p>{item.date}</p>
                <a
                  href={`https://apod.nasa.gov/apod/ap${item.date.replace(/-/g, '').slice(2)}.html`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Original
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Search;
