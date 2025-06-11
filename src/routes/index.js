const user = require('./user.route')
const item = require('./item.route')
const category = require('./category.route')
const order = require('./order.route')
const report = require('./report.route')
const auth = require('./auth.route')
const otp = require('./otp.route')

const jwtMiddleware = require('../middlewares/jwt')

module.exports = (app) => {
    app.use(jwtMiddleware)
    app.use('/api/user/',user );
    app.use('/api/item/',item );
    app.use('/api/category/', category );
    app.use('/api/order/', order );
    app.use('/api/report/', report );
    app.use('/api/auth/', auth );
    app.use('/api/otp/', otp );
}