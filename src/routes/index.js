const user = require('./user.route')
const item = require('./item.route')
const category = require('./category.route')

module.exports = (app) => {
    app.use('/api/user/',user );
    app.use('/api/item/',item );
    app.use('/api/category/', category );
}