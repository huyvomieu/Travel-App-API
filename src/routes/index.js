const user = require('./user.route')
const item = require('./item.route')

module.exports = (app) => {
    app.use('/api/user/',user );
    app.use('/api/item/',item );
}