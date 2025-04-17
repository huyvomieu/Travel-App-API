module.exports = (obj) => {
    return Object.keys(obj).map(key => ({
        key,
        ...obj[key]
    }))
}