const fs = require('fs');

const PORT = process.env.PORT || 4000;
const API_URL = process.env.API_URL || '/api';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || 999999;
const TENSOR_DIMENSIONS = process.env.TENSOR_DIMENSIONS || 3500;

let temp_pr = '';
let temp_pb = '';
try {
    temp_pr = fs.readFileSync(`${__dirname}/keys/private.key`);
    temp_pb = fs.readFileSync(`${__dirname}/keys/public.key`);
}
catch (err) {
}

const RSA_PRIVATE_KEY = temp_pr;
const RSA_PUBLIC_KEY = temp_pb;
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