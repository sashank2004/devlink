const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const redis = require('./src/config/redis');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/urls', require('./src/routes/url.routes'));

app.get('/:code', async (req, res) => {
  const code = req.params.code;
  const Url = require('./src/models/Url');
  const Click = require('./src/models/Click');

  try {
    // Step 1: Check Redis first
    const cached = await redis.get(code);

    if (cached) {
      console.log('Cache HIT for:', code);
      await Click.create({ shortCode: code, ip: req.ip, userAgent: req.headers['user-agent'] });
      return res.redirect(cached);
    }

    // Step 2: Cache miss — hit MongoDB
    console.log('Cache MISS for:', code);
    const url = await Url.findOne({ shortCode: code });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    // Step 3: Save to Redis with 24hr expiry
    await redis.setex(code, 86400, url.longUrl);

    await Click.create({ shortCode: code, ip: req.ip, userAgent: req.headers['user-agent'] });
    res.redirect(url.longUrl);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => res.json({ message: 'DevLink API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
