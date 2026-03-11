const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

// POST /api/urls — create short URL
router.post('/', async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: 'longUrl is required' });

  try {
    const shortCode = nanoid(7); // 7-char random code e.g. "aB3kR9x"
    const url = await Url.create({ longUrl, shortCode });
    res.json({
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      shortCode,
      longUrl: url.longUrl
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/urls/:code/stats — analytics for a short URL
router.get('/:code/stats', async (req, res) => {
  const Click = require('../models/Click');
  const clicks = await Click.find({ shortCode: req.params.code }).sort({ timestamp: -1 });
  res.json({ totalClicks: clicks.length, clicks });
});

module.exports = router;