import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import '../css/Visualizations.css';

function Visualizations() {
  const [mediaStats, setMediaStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 100);

      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      try {
        const res = await fetch(`http://localhost:5000/api/apod-range?start_date=${startStr}&end_date=${endStr}`);
        const data = await res.json();

        const counts = { image: 0, video: 0 };
        data.forEach(item => {
          if (item.media_type === 'image') counts.image++;
          else if (item.media_type === 'video') counts.video++;
        });

        const formatted = Object.entries(counts).map(([type, count]) => ({
          type,
          count
        }));

        setMediaStats(formatted);
      } catch (err) {
        console.error('Failed to fetch media type stats:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="visualization-page">
      <h2>Media Type Distribution (Last 30 Days)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mediaStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#1e90ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Visualizations;
