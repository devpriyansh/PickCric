const express = require('express');
const router = express.Router();
const dfsController = require('../controllers/dfsController');
const {getLiveJackpots, getJackpotById, submitJackpotEntry} = require('../controllers/dfsController')
const staticMatches = require('../utils/staticMatches');

// POST /api/jackpots
router.get('/getLiveJackpots',getLiveJackpots);
router.get('/getJackpotById/:id',getJackpotById);
router.post('/contests/submit', submitJackpotEntry);

// GET /api/matches
router.get('/matches', (req, res) => {
  res.json(staticMatches);
});

module.exports = router;
