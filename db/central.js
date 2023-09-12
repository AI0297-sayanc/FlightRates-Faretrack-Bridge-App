const mongoose = require("mongoose")
const CENTRAL_CONN = mongoose.createConnection(process.env.MONGODB_CENTRAL_CONNECTION_STRING)
module.exports = CENTRAL_CONN
