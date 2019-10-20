const { extractHostname } = require('./handlers');
const { getUser, getData, addData } = require('./../schema');

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