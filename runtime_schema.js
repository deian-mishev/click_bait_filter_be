const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { saltHashPassword, getHash, getIp } = require('./api/handlers');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error',
    console.error.bind(console, 'Connection error:')
);

const Schema = mongoose.Schema;

const tabsSchema = new Schema({
    id: Number,
    page: String
});

const dataClicksSchema = new Schema({
    url: String,
    tf_score: { type: Number, default: 0.0 },
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

const findOneOrCreate = async function (condition) {
    const self = this
    const el = await self.findOne(condition);
    if (!el) {
        return await self.create(condition)
    }
    return el;
}

dataLayer.statics.findOneOrCreate = findOneOrCreate;

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

const queryUser = async (name) => {
    return await userModel.findOne({ name: name }).then(function (user) {
        if (user) {
            const { passwordHash, salt } = user.passwordData;
            return passwordHash === getHash(user.name, salt) ? user : false;
        };

        return false;
    }).catch(function (error) {
        console.log('one of the queries failed', error);
    });
}

const getUser = async (req) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    const payload = jwt.decode(token);
    return queryUser(
        getHash(payload.name, getIp(req))
    );
}

const getUserFromToken = async (req, token) => queryUser(
    getHash(token, getIp(req))
);

const addUser = async (req, token) => {
    const mix = getHash(token, getIp(req));
    const passwordData = saltHashPassword(mix);
    const user = new userModel({
        name: mix,
        passwordData: passwordData
    });
    await user.save((err, user) => {
        if (err) return console.error(err);
    })
}

const getOrCreateData = async (page) => await dataModel.findOneOrCreate({ domain: page });

const getData = async (page) => await dataModel.findOne({ domain: page });

const getAllData = async () => await dataModel.find({});

const addData = async (page, link, ts_model) => {
    const data = new dataModel({
        domain: page,
        links: [
            {
                url: link,
                tf_score: ts_model,
            }
        ]
    });
    return await data.save((err, a) => {
        if (err) return console.log(err);
        return a;
    })
}

const removeUrl = async (domain, url) => {
    await dataModel.updateOne({ domain }, { $pull: { 'links': { url } } });
}

const removeDomain = async (domain) => {
    await dataModel.deleteOne({ domain });
}

module.exports = {
    addUser,
    getUser,
    getData,
    addData,
    getOrCreateData,
    getAllData,
    removeUrl,
    removeDomain,
    getUserFromToken
}