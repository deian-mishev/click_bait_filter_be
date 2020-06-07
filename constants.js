const fs = require('fs');

const TOKEN_EXPIRATION = 999999;
const TENSOR_DIMENTIONS = 3500;
const PORT = process.env.PORT || 8080;
const API_URL = process.env.API_URL || '/api';
const STATIC_SERVE = process.env.SERVETYPE === 'STATIC';
const RSA_PRIVATE_KEY = fs.readFileSync(`${__dirname}/keys/private.key`);
const RSA_PUBLIC_KEY = fs.readFileSync(`${__dirname}/keys/public.key`);
const JWT_ALGORITHM = 'RS256';

module.exports = {
    TENSOR_DIMENTIONS,
    TOKEN_EXPIRATION,
    PORT,
    API_URL,
    STATIC_SERVE,
    RSA_PRIVATE_KEY,
    RSA_PUBLIC_KEY,
    JWT_ALGORITHM
}