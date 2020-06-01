const fs = require('fs');
const crypto = require('crypto');
const tf = require('@tensorflow/tfjs-node');
const tf_data_mapping = require(`${__dirname}/model/mapping.json`);
let tf_model;
(async () => {
    tf_model = await tf.loadLayersModel(`file://${__dirname}/model/model.json`);
})()

const getModelScore = url => {
    let score = 0.0;
    const found = url.
        match(/\/(?=[^/]*$)(.*?)(\.|\?|$)/);

    if (found) {
        const combined = [];
        const el = found[1].split('-')
            .filter(Boolean)
            .filter(a => a.match(/^[a-z]+$/))

        if (el.length >= 2) {
            for (let index = 0; index < el.length; index++) {
                const element = el[index];
                const ind_num = tf_data_mapping[element];
                if (ind_num) {
                    combined.push(ind_num);
                } else {
                    const number = updateModelData(element);
                    if (number >= 3500) {
                        console.log('Model needs to be retrained');
                    }
                    combined.push(number);
                }
            }

            const seq = vectorizeSequence(combined);
            score = tf_model
                .predict(seq, { batchSize: 1 })
                .dataSync()[0];
        }
    }
    return score;
}

const vectorizeSequence = (sequence, dimension = 3500) => {
    let results = new Array(dimension).fill(0.0);
    for (let index = 0; index < sequence.length; index++) {
        const element = sequence[index];
        results[element] = 1.0
    }
    return tf.tensor2d([results], [1, dimension]);
}


const updateModelData = element => {
    const num = Math.max(...Object.values(tf_data_mapping)) + 1;
    tf_data_mapping[element] = num;
    fs.writeFile(
        `${__dirname} / model / mapping.json`,
        JSON.stringify(tf_data_mapping, null, 4),
        'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    return num;
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
    getModelScore,
    extractHostname,
    saltHashPassword,
    getHash,
    getIp
}