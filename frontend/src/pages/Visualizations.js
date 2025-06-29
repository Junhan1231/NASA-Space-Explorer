import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line
} from 'recharts';
import '../css/Visualizations.css';

function Visualizations() {
  const [mediaStats, setMediaStats] = useState([]);
  const [asteroidData, setAsteroidData] = useState([]);
  const [asteroidDistanceData, setAsteroidDistanceData] = useState([]);
  const [solarActivityData, setSolarActivityData] = useState([]);

  // Fetch Media Type Distribution (past 30 days)
  useEffect(() => {
    const fetchMediaStats = async () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 70);

      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      try {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?start_date=${startStr}&end_date=${endStr}&api_key=DEMO_KEY`);
        const data = await res.json();

        const counts = { image: 0, video: 0 };
        data.forEach(item => {
          if (item.media_type === 'image') counts.image++;
          else if (item.media_type === 'video') counts.video++;
        });

        setMediaStats(Object.entries(counts).map(([type, count]) => ({ type, count })));
      } catch (err) {
        console.error('Failed to fetch media stats:', err);
      }
    };

    fetchMediaStats();
  }, []);

  // Fetch Near-Earth Asteroids count (7 days)
  useEffect(() => {
    const fetchAsteroids = async () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);

      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      try {
        const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startStr}&end_date=${endStr}&api_key=DEMO_KEY`);
        const json = await res.json();

        const dailyCounts = [];
        const distanceData = [];

        Object.entries(json.near_earth_objects).forEach(([date, list]) => {
          dailyCounts.push({ date, count: list.length });

          // Average min distance per day
          const avgDist = list.reduce((acc, item) => acc + parseFloat(item.close_approach_data[0]?.miss_distance?.lunar || 0), 0) / list.length;
          distanceData.push({ date, avgDist: parseFloat(avgDist.toFixed(2)) });
        });

        setAsteroidData(dailyCounts.sort((a, b) => new Date(a.date) - new Date(b.date)));
        setAsteroidDistanceData(distanceData.sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch (err) {
        console.error('Failed to fetch asteroid data:', err);
      }
    };

    fetchAsteroids();
  }, []);

  // Fetch Solar Activity (DONKI CME)
  useEffect(() => {
    const fetchSolar = async () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);

      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      try {
        const res = await fetch(`https://api.nasa.gov/DONKI/CME?startDate=${startStr}&endDate=${endStr}&api_key=DEMO_KEY`);
        const data = await res.json();

        const dailyCounts = {};
        data.forEach(cme => {
          const date = cme.startTime.split('T')[0];
          dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });

        const formatted = Object.entries(dailyCounts).map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setSolarActivityData(formatted);
      } catch (err) {
        console.error('Failed to fetch solar activity:', err);
      }
    };

    fetchSolar();
  }, []);

  return (
    <div className="visualization-page">
      <h2>NASA Data Visualizations</h2>
      <div className="chart-grid">

        <div className="chart-box">
          <h3>Near Earth Asteroids (Past 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={asteroidData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#00ccff" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Media Type Distribution (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mediaStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1e90ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Asteroid Avg Miss Distance (Lunar, 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={asteroidDistanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgDist" fill="#ffa500" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Solar CMEs (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={solarActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#ff6347" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Visualizations;
