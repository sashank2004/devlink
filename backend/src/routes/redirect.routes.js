const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const Click = require('../models/Click');

// GET /:code — resolve and redirect
router.get('/', async (req, res) => {
  const code = req.params.code;  
  console.log('Looking up code:', code); // add this to debug
  
  try {
    const url = await Url.findOne({ shortCode: code });
    console.log('Found URL:', url); // and this
    
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

module.exports = router;