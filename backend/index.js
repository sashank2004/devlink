const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/urls', require('./src/routes/url.routes'));

// Fix: add { mergeParams: true } isn't here, the issue is how we mount
// Change this line:
app.get('/:code', async (req, res) => {
  const code = req.params.code;
  console.log('Looking up code:', code);

  const Url = require('./src/models/Url');
  const Click = require('./src/models/Click');

  try {
    const url = await Url.findOne({ shortCode: code });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    await Click.create({
      shortCode: code,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.redirect(url.longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => res.json({ message: 'DevLink API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));