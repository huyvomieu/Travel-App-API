
const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()


const routes = require('./routes')


const app = express()
app.use(cors());
app.use(bodyParser.json());

app.get('/' , (req,res) => {
  res.send('Welcome to Travel App API , Build by Huy Ng')
})
// Routing
routes(app)

app.listen(process.env.PORT, () => {
  console.log(` app listening on port ${process.env.PORT}`)
})