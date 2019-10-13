const jwt = require('jsonwebtoken');

const {
    TOKEN_EXPIRATION,
    RSA_PRIVATE_KEY,
    JWT_ALGORITHM
} = require('../constants');

const { getHash, extractHostname } = require('./handlers');
const { getUser, getData, addData } = require('./../schema');

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

const fetchPageSegmentation = async (req, res) => {
    let data = {};

    const user = await getUser(req);

    if (user) {
        if (req.body.page) {
            const page = extractHostname(req.body.page);
            if (!user.tabs.find(a => a.id === req.body.tabId)) {
                user.tabs.push({
                    id: req.body.tabId,
                    page: page
                });
                user.save();
            }

            data = await getData(page) || {};
        } else {
            const tab = user.tabs.find(a => a.id === req.body.tabId);
            if (tab) {
                data = await getData(tab.page) || {}
            }
        }
    }

    if (data.links) {
        let temp = {};
        data.links.forEach(element => {
            temp[element.url] = element.count;
        });
        data = temp;
    }

    res.send(data);
};

const registerLink = async (req, res) => {
    const params = req.body;
    const domain = extractHostname(params.domain);

    const user = await getUser(req);

    if (user) {
        let data = await getData(domain);

        if (!data) {
            data = await addData(domain, params.link)
        } else {
            const link = data.links.find(a => a.url === params.link);
            if (!link) {
                data.links.push(
                    {
                        url: params.link
                    }
                );
            } else {
                link.count++;
            }
            data.save();
        }
        const click = user.clicks.find(a => a.url === params.link);
        if (click) {
            click.count++;
        } else {
            user.clicks.push({
                url: params.link
            })
        }
        user.save();
    }

    res.send();
};

module.exports = {
    registerLink,
    fetchPageSegmentation,
    authenticate
}