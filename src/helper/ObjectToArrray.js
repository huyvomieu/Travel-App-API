module.exports = (obj) => {
    if(!obj) {
        return []
    }
    return Object.keys(obj).map(key => ({
        ...obj[key],
        key,
    }))
}