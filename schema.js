const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { saltHashPassword, getHash } = require('./api/handlers');

mongoose.connect('mongodb://127.0.0.1/clickbait_filter', { useNewUrlParser: true },
    function () {
        mongoose.connection.db.dropDatabase();
    }
);

const db = mongoose.connection;

db.on('error',
    console.error.bind(console, 'MongoDB connection error:')
);

const Schema = mongoose.Schema;

const tabsSchema = new Schema({
    id: Number,
    page: String
});

const dataClicksSchema = new Schema({
    url: String,
    count: { type: Number, default: 1 }
});

const userClicksSchema = new Schema({
    domain: String,
    url: String,
    time: { type: Date, default: Date.now }
});

const dataLayer = new Schema({
    domain: String,
    links: [dataClicksSchema]
});

const userLayer = new Schema({
    name: String,
    tabs: [tabsSchema],
    clicks: [userClicksSchema],
    passwordData: {
        passwordHash: String,
        salt: String
    }
});

const userModel = mongoose.model('userModel', userLayer);
const dataModel = mongoose.model('dataModel', dataLayer);

const getUser = async (req) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const token = req.headers.authorization.replace('Bearer ', '');
    const payload = jwt.decode(token);

    const user = await userModel.find({ name: payload.name + ip }).then(function (users) {
        const tempUser = users.find(function (x) {
            const { passwordHash, salt } = x.passwordData;
            return passwordHash === getHash(x.name, salt);
        });

        return tempUser;
    }).catch(function (error) {
        console('one of the queries failed', error);
    });
    return user;
}

const getUserFromToken = async (req, token) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const user = await userModel.find({ name: token + ip }).then(function (users) {
        const tempUser = users.find(function (x) {
            const { passwordHash, salt } = x.passwordData;
            return passwordHash === getHash(x.name, salt);
        });

        return tempUser;
    }).catch(function (error) {
        console('one of the queries failed', error);
    });
    return user;
}

const addUser = async (token) => {
    const passwordData = saltHashPassword(token);
    const user = new userModel({
        name: token,
        passwordData: passwordData
    });
    await user.save((err, user) => {
        if (err) return console.error(err);
    })
}

const getData = async (page) => {
    const data = await dataModel.findOne({ domain: page });
    return data;
}

const addData = async (page, link) => {
    const data = new dataModel({
        domain: page,
        links: [
            {
                url: link
            }
        ]
    });
    return await data.save((err, a) => {
        if (err) return console.error(err);
        return a;
    })
}

module.exports = {
    addUser,
    getUser,
    getData,
    addData,
    getUserFromToken
}