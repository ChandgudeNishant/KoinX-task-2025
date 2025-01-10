// schemas/cryptoSchemas.js
const Joi = require('joi');

const statsSchema = Joi.object({
    coin: Joi.string()
        .valid('bitcoin', 'matic-network', 'ethereum')
        .required()
        .messages({
            'any.required': 'Coin is required',
            'any.only': 'Coin must be one of bitcoin, matic-network, or ethereum',
        }),
});

const deviationSchema = Joi.object({
    coin: Joi.string()
        .valid('bitcoin', 'matic-network', 'ethereum')
        .required()
        .messages({
            'any.required': 'Coin is required',
            'any.only': 'Coin must be one of bitcoin, matic-network, or ethereum',
        }),
});

module.exports = { statsSchema, deviationSchema };
