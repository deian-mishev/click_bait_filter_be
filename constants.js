const fs = require('fs');

const PORT = process.env.PORT || 4000;
const API_URL = process.env.API_URL || '/api';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || 999999;
const TENSOR_DIMENSIONS = process.env.TENSOR_DIMENSIONS || 5000;
const RSA_PRIVATE_KEY = fs.readFileSync(`${__dirname}/keys/private.key`);
const RSA_PUBLIC_KEY = fs.readFileSync(`${__dirname}/keys/public.key`);
const JWT_ALGORITHM = 'RS256';

module.exports = {
    TENSOR_DIMENSIONS,
    TOKEN_EXPIRATION,
    PORT,
    API_URL,
    RSA_PRIVATE_KEY,
    RSA_PUBLIC_KEY,
    JWT_ALGORITHM
}