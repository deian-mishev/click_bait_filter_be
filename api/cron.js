const axios = require('axios');
const scheduler = require('node-schedule');
const { getAllData, removeUrl, removeDomain } = require('../runtime_schema');

module.exports.run = () => {
    const rule = new scheduler.RecurrenceRule();
    rule.hour = 7
    rule.dayOfWeek = new scheduler.Range(0, 6)
    scheduler.scheduleJob(rule, function () {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        console.log('Running Cron Scheduler: ' +
            year +
            "-" + month +
            "-" + date +
            " " + hours +
            ":" + minutes +
            ":" + seconds);
        runtimeDatabaseCleanup();
    });
}

const runtimeDatabaseCleanup = async () => {
    const data = await getAllData();
    for (let i = 0; i < data.length; i++) {
        const site = data[i];
        const domain = site.domain;
        const len = site.links.length;
        for (let j = 0; j < len; j++) {
            const url = site.links[j].url;
            try {
                await axios.get(url);
            } catch (error) {
                console.log('Removing: ' + url);
                removeUrl(domain, url);
                len--;
            }
        }
        if (len === 0) {
            removeDomain(domain);
        }
    }
}