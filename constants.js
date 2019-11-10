const fs = require('fs');
const path = require('path');

const TOKEN_EXPIRATION = 999999;
const PORT = process.env.PORT || 8080;
const API_URL = process.env.API_URL || '/api';
const STATIC_SERVE = process.env.SERVETYPE === 'STATIC';
const RESOURCES = path.join(__dirname, 'resources/');
// const RSA_PRIVATE_KEY = fs.readFileSync(`${__dirname}/private.key`);
// const RSA_PUBLIC_KEY = fs.readFileSync(`${__dirname}/public.key`);
const JWT_ALGORITHM = 'RS256';

const HTML = path.join(__dirname, 'public/');
const ENTRY = path.join(HTML, 'index.html');

module.exports = {
    TOKEN_EXPIRATION,
    PORT,
    API_URL,
    STATIC_SERVE,
    // RSA_PRIVATE_KEY,
    // RSA_PUBLIC_KEY,
    JWT_ALGORITHM,
    HTML,
    RESOURCES,
    ENTRY
}