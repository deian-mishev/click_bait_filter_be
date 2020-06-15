const findSplit = (splits, url) => {
    const letters = /^[a-z]+$/
    for (let index = 0; index < splits.length; index++) {
        const split = splits[index];
        let el = url.split(split)
            .filter(Boolean)
            .filter(a => a.match(letters))
        if (el.length > 2) {
            return el;
        }
    }
    return false;
}

const isPresent = (url, val) => url.indexOf(val) !== -1;

const getUrl = url => {
    let res = false;
    if (!isPresent(url, '.php') && !isPresent(url, '.jsp')) {
        let newUrl = url.replace('/?', '?');
        if (newUrl[newUrl.length - 1] === '/') {
            newUrl = newUrl.substring(0, newUrl.length - 1)
        }

        const found = newUrl.
            match(/^[http:\/\/|https:\/\/].*\/(?=[^/]*$)(.*?)(\.|\?|$)/);

        if (found && found[1]) {
            res = findSplit(['-', '_'], found[1]);
        }
    }

    return res;
}

module.exports = {
    getUrl
}