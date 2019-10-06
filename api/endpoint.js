const fs = require('fs');
const jwt = require('jsonwebtoken');

const {
    TOKEN_EXPIRATION,
    RSA_PRIVATE_KEY,
    JWT_ALGORITHM,
    RESOURCES
} = require('../constants');

const { getHash, extractHostname, getUser } = require('./handlers');
const { userLayer, dataLayer } = require('./../schema');

const authenticate = (req, res) => {
    const { username, password } = req.body;

    const user = users.find(x => {
        if (x.username === username) {
            const { passwordHash, salt } = x.passwordData;
            return passwordHash === getHash(password, salt);
        }
        return false;
    });

    if (!user) {
        res.status(418);
        res.send({ message: 'Username or password is incorrect' });
        return;
    }

    const jwtBearerToken = jwt.sign({
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language,
        expiresIn: TOKEN_EXPIRATION,
        scope: [
            `role:${user.role}`
        ]
    }, RSA_PRIVATE_KEY, {
        algorithm: JWT_ALGORITHM,
        keyid: 'M2maFm3VYlMBOn3GetVWGXkrKrk',
        subject: user.id
    });

    res.send({
        token: jwtBearerToken
    });
};

const fetchPageSegmentation = (req, res) => {
    let data = {};

    const user = getUser(req, userLayer);

    if (user) {
        if (req.body.page) {
            const page = extractHostname(req.body.page);
            user.tabs[req.body.tabId] = page;
            data = dataLayer[page] || {};
        } else {
            data = dataLayer[user.tabs[req.body.tabId]] || {};
        }
    }

    res.send(data);
};

const registerLink = (req, res) => {
    const params = req.body;
    const domain = extractHostname(params.domain);

    const user = getUser(req, userLayer);

    // DATA LAYER
    if (!user.clicks[params.link]) user.clicks[params.link] = 0;
    if (!dataLayer[domain]) dataLayer[domain] = { [params.link]: 0 };
    if (!dataLayer[domain][params.link]) dataLayer[domain][params.link] = 0;

    user.clicks[params.link]++;
    dataLayer[domain][params.link]++;

    res.send();
};

const translation = (req, res) => {
    if (req.query && req.query.language) {
        fs.readFile(`${RESOURCES}/i18n/${req.query.language}.json`, 'utf8', function (err, data) {
            if (err) {
                res.status(418);
                res.send({ message: 'Inexisting Language' });
                return;
            }
            res.send(data);
            res.end(data);
        });
    } else {
        res.status(418);
        res.send({ message: 'No local data' });
    }
};

module.exports = {
    registerLink,
    fetchPageSegmentation,
    translation,
    authenticate
}