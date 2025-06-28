const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const NASA_API_KEY = 'iSVfNOAvaYb6xnkScvFZKSjYTeIKvFvZFmASUbzw'; // 替换为你的 key

// ✅ 单个日期请求（你已有的）
app.get('/api/apod', async (req, res) => {
  try {
    const { date } = req.query;
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}${date ? `&date=${date}` : ''}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'NASA APOD API failed' });
  }
});

// ✅ 新增：支持按日期区间获取 APOD 图像列表
app.get('/api/apod-range', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date and end_date are required' });
    }

    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&start_date=${start_date}&end_date=${end_date}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'NASA APOD range API failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});
