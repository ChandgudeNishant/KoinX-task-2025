const express = require('express');
const { getStats, getDeviation } = require('../controllers/cryptoController');
const validateRequest = require('../middlewares/validationMiddleware');
const { statsSchema, deviationSchema } = require('../schemas/cryptoSchemas');

const router = express.Router();

// GET /api/stats?coin=bitcoin - Get latest stats for a coin
router.get('/stats', validateRequest(statsSchema, 'query'), getStats);

// GET /api/deviation?coin=bitcoin - Get standard deviation for a coin
router.get('/deviation', validateRequest(deviationSchema, 'query'), getDeviation);

module.exports = router;
