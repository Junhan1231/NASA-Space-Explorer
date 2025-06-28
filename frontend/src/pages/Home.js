import { useEffect, useState, useRef } from 'react';
import '../css/Home.css';

function Home() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState('');
  const [hasSelected, setHasSelected] = useState(false);
  const [recentImages, setRecentImages] = useState([]);
  const scrollRef = useRef(null);
  const [scrollDir, setScrollDir] = useState(1);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const fetchData = async (selectedDate = '') => {
    try {
      const res = await fetch(`http://localhost:5000/api/apod${selectedDate ? `?date=${selectedDate}` : ''}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Error fetching APOD:', error);
    }
  };

  const getOfficialApodUrl = (date) => {
    const [year, month, day] = date.split("-");
    return `https://apod.nasa.gov/apod/ap${year.slice(2)}${month}${day}.html`;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setHasSelected(true);
    fetchData(selectedDate);
  };

  useEffect(() => {
    const fetchRecentImages = async () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 4);
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      try {
        const res = await fetch(`http://localhost:5000/api/apod-range?start_date=${startStr}&end_date=${endStr}`);
        const json = await res.json();
        setRecentImages(json.reverse());
      } catch (error) {
        console.error('Error fetching recent APODs:', error);
      }
    };

    fetchRecentImages();
  }, []);


  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scroll = () => {
      container.scrollLeft += scrollDir;

      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll) {
        setScrollDir(-1);
      } else if (container.scrollLeft <= 0) {
        setScrollDir(1); 
      }
    };

    const interval = setInterval(scroll, 30); 
    return () => clearInterval(interval);
  }, [scrollDir]);

  return (
    <>
      <header
        className={`banner ${hasSelected ? 'fade' : ''}`}
        key={hasSelected && data ? data.date : 'welcome'}
        style={{
          backgroundImage: `url(${hasSelected && data ? data.url : "/welcome-bg.JPG"})`,
        }}
      >
        <div className="banner-content">
          {hasSelected && data ? (
            <>
              <h1>{data.title}</h1>
              <p className="description">{data.explanation?.slice(0, 200)}...</p>
              <a
                href={getOfficialApodUrl(data.date)}
                target="_blank"
                rel="noreferrer"
                className="learn-button"
              >
                Learn More
              </a>
            </>
          ) : (
            <>
              <h1>Welcome to NASA Space Explorer</h1>
              <p className="description">
                Discover NASA's Astronomy Pictures of the past 5 days. Choose a date to explore more!
              </p>
            </>
          )}
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            max={todayStr}
            className="date-picker"
          />
        </div>
      </header>

      <div className="main-content">
        <div className="page-content">
          <section className="carousel">
            <h2>Featured: Past 5 Days of NASA APOD</h2>
            <div className="card-row" ref={scrollRef}>
              {recentImages.map((img, i) => (
                <a
                  key={i}
                  href={getOfficialApodUrl(img.date)}
                  target="_blank"
                  rel="noreferrer"
                  className="card-featured"
                  style={{ backgroundImage: `url(${img.url})` }}
                >
                  <div className="card-label">{img.title || img.date}</div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Home;
