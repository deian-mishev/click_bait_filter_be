const {
    extractHostname,
    getModelScore,
    getScoredModelLinks
} = require('./handlers');
const {
    getUser,
    getData,
    addData,
    getOrCreateData
} = require('../runtime_schema');

const fetchPageSegmentation = async (req, res) => {
    let data = {};
    const user = await getUser(req);
    if (!user) {
        res.send(data);
        return;
    }

    // REGISTERING DOMAIN
    if (req.body.page) {
        // IS REQUEST FROM ON PAGE
        const page = extractHostname(req.body.page);
        if (!user.tabs.find(a => a.id === req.body.tabId)) {
            user.tabs.push({
                id: req.body.tabId,
                page: page
            });
            user.save();
        }

        data = await getOrCreateData(page);
    } else {
        // IS REQUEST FROM ON TAB
        const tab = user.tabs.find(a => a.id === req.body.tabId);
        if (tab) {
            data = await getOrCreateData(tab.page);
        }
    }

    // IS REQUEST FROM ON PAGE AND LINKS ARE AVAILABLE
    if (req.body.links) {
        let tempLinks = req.body.links;
        if (data.links) {
            // FILTER LINKS THAT ARE NOT REGISTERED
            const dbLinks = data.links.map(a => a.url);
            tempLinks = tempLinks.filter(a => dbLinks.indexOf(a) === -1);
        } else {
            data.links = [];
        }
        // IF ANY REGISTER AND SCORE
        if (tempLinks.length > 0) {
            data.links = data.links.concat(
                getScoredModelLinks(tempLinks)
            )
            data.save();
        }
    }

    if (data.links && data.links.length > 0) {
        const temp = {};
        data.links.forEach(element => {
            temp[element.url] = element.tf_score;
        });

        data = temp;
    } else {
        data = false;
    }

    res.send(data);
};

const registerLink = async (req, res) => {
    const params = req.body;
    const domain = extractHostname(params.domain);

    const user = await getUser(req);

    if (user) {
        // ONE DATALAYER GENERATED CLICK PER USER
        if (!user.clicks.find(a =>
            a.domain === domain &&
            a.url === params.link
        )) {
            const data = await getData(domain);
            if (!data) {
                await addData(
                    domain,
                    params.link,
                    getModelScore(params.link))
            } else {
                const link = data.links.find(
                    a => a.url === params.link
                );
                if (!link) {
                    data.links.push(
                        {
                            url: params.link,
                            tf_score: getModelScore(params.link)
                        }
                    );
                } else {
                    link.count++;
                }
                data.save();
            }
        }
        // RECORD ALL USER CLICKS
        user.clicks.push({
            domain: domain,
            url: params.link
        })
        user.save();
    }

    res.send();
};

module.exports = {
    registerLink,
    fetchPageSegmentation
}