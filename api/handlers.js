const crypto = require('crypto');

const extractHostname = url => {
    let hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split("/")[2];
    } else {
        hostname = url.split("/")[0];
    }
    hostname = hostname.split(":")[0];
    hostname = hostname.split("?")[0];
    return hostname;
};

const getHash = (password, salt) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('hex');
}

const genRandomHash = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

const sha512 = (password, salt) => {
    const value = getHash(password, salt);
    return {
        salt: salt,
        passwordHash: value
    };
};

const saltHashPassword = (userpassword) => {
    const salt = genRandomHash(32);
    return sha512(userpassword, salt);
}

module.exports = {
    extractHostname,
    saltHashPassword,
    getHash
}