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
    if (isPresent(url, '.html')) {
        url = url.split(".html")[0];
        const found = url.
            match(/(([^\/|=|?|_|-]+)(?=(\.\w+$)|(\.$)|(\/+$)|-|_))+/g);
        if (found && found.length && found.length > 3) {
            res = found;
        }

        return res;
    }

    return res;
}

module.exports = {
    getUrl
}