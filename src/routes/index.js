const user = require('./user.route')
const item = require('./item.route')
const category = require('./category.route')
const order = require('./order.route')
const report = require('./report.route')

module.exports = (app) => {
    app.use('/api/user/',user );
    app.use('/api/item/',item );
    app.use('/api/category/', category );
    app.use('/api/order/', order );
    app.use('/api/report/', report );
}