
const axios = require('axios');
const CryptoData = require('../models/CryptoData');
const logger = require('../utils/logger');


const fetchCryptoData = async () => {
    const COINS = ['bitcoin', 'matic-network', 'ethereum'];
    const API_URL = 'https://api.coingecko.com/api/v3/simple/price';

    try {
        logger.info('Starting to fetch cryptocurrency data from CoinGecko...');
        
        const response = await axios.get(API_URL, {
            params: {
                ids: COINS.join(','),
                vs_currencies: 'usd',
                include_market_cap: true,
                include_24hr_change: true,
            },
        });

        const data = response.data;

        for (const coin of COINS) {
            const coinData = {
                coin,
                price: data[coin].usd,
                marketCap: data[coin].usd_market_cap,
                change24h: data[coin].usd_24h_change,
            };

            logger.info(`Inserting data for ${coin}: ${JSON.stringify(coinData)}`);
            await CryptoData.create(coinData);
        }

        logger.info('Crypto data updated successfully.');
    } catch (error) {
        logger.error(`Error fetching crypto data: ${error.message}`);
    }
};


const getStats = async (req, res, next) => {
    const { coin } = req.query;

    try {
        const latestData = await CryptoData.findOne({ coin }).sort({ timestamp: -1 });

        if (!latestData) {
            logger.warn(`No data found for coin: ${coin}`);
            return res.status(404).json({
                success: false,
                message: 'No data found for this coin',
            });
        }

        res.json({
            success: true,
            data: {
                price: latestData.price,
                marketCap: latestData.marketCap,
                '24hChange': latestData.change24h,
            },
        });
    } catch (error) {
        logger.error(`Error fetching stats for coin ${coin}: ${error.message}`);
        next(error); 
    }
};


const getDeviation = async (req, res, next) => {
    const { coin } = req.query;

    try {
        const records = await CryptoData.find({ coin }).sort({ timestamp: -1 }).limit(100);

        if (records.length < 2) {
            logger.warn(`Not enough data points for coin: ${coin}`);
            return res.status(400).json({
                success: false,
                message: 'Not enough data points',
            });
        }

        const prices = records.map((record) => record.price);

        const mean = prices.reduce((acc, val) => acc + val, 0) / prices.length;

        const variance =
            prices.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / prices.length;
        const stdDeviation = Math.sqrt(variance);

        res.json({
            success: true,
            deviation: stdDeviation.toFixed(2),
        });
    } catch (error) {
        logger.error(`Error calculating deviation for coin ${coin}: ${error.message}`);
        next(error); 
    }
};

module.exports = { fetchCryptoData, getStats, getDeviation };
