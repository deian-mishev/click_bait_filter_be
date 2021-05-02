const fs = require('fs');
const crypto = require('crypto');
const tfn = require("@tensorflow/tfjs-node");
const { TENSOR_DIMENSIONS } = require('../constants');
const { getUrl } = require('./url_get');

let tf_data_mapping = require('../model/mapping.json');

let tf_model;
(async () => {
    tf_model =
        await tfn.loadLayersModel(`file://${__dirname}/../model/model.json`);
})()

const getModelScore = url => {
    let score = 0;
    const el = getUrl(url);
    if (el) {
        const seq = vectorizeSequences([textToTFIndex(el)]);
        score = tf_model
            .predict(seq, { batchSize: 1 })
            .dataSync()[0];
    }
    return score;
}

const textToTFIndex = el => {
    const combined = [];
    const toBeUpdated = {};
    let count = Math.max(...Object.values(tf_data_mapping));
    for (let j = 0; j < el.length; j++) {
        const element = el[j];
        const ind_num = tf_data_mapping[element];
        if (ind_num) {
            combined.push(ind_num);
        } else {
            toBeUpdated[element] = ++count;
        }
    }
    if (Object.keys(toBeUpdated).length > 0) {
        console.log('Model needs to be retrained');
        updateModelData(toBeUpdated);
    }
    return combined;
}

const getScoredModelLinks = (urls, links) => {
    const activeLinks = [];
    const seq = [];
    for (let i = 0; i < urls.length; i++) {
        const el = links[urls[i]];
        activeLinks.push({
            url: urls[i],
            count: 0
        });
        seq.push(textToTFIndex(el));
    }
    // Batch Model Processing
    if (seq.length > 0) {
        const scores = tf_model
            .predict(vectorizeSequences(seq))
            .dataSync();
        for (let index = 0; index < activeLinks.length; index++) {
            const element = activeLinks[index];
            element.tf_score = scores[index];
        }
    }
    return activeLinks;
}

const vectorizeSequences = (sequences, dimension = TENSOR_DIMENSIONS) => {
    let results = [];
    for (let i = 0; i < sequences.length; i++) {
        const result = new Array(dimension).fill(0.0);
        const element = sequences[i];
        for (let j = 0; j < element.length; j++) {
            result[j] = element[j];
        }
        results = results.concat(result);
    }
    return tfn.tensor2d(results, [sequences.length, dimension]);
}

const updateModelData = elements => {
    tf_data_mapping = { ...tf_data_mapping, ...elements };
    fs.writeFileSync(
        `${__dirname}/../model/mapping.json`,
        JSON.stringify(tf_data_mapping),
        'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
}

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

const getIp = req => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip.replace(/\./g, '');
}

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
    getScoredModelLinks,
    getModelScore,
    extractHostname,
    saltHashPassword,
    getHash,
    getIp
}