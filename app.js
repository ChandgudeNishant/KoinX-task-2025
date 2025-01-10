require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cron = require('node-cron');
const { fetchCryptoData } = require('./controllers/cryptoController');
const cryptoRoutes = require('./routes/cryptoRoutes');

const app = express();
app.use(express.json());

connectDB();

cron.schedule('0 */2 * * *', fetchCryptoData);

app.use('/api', cryptoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);
