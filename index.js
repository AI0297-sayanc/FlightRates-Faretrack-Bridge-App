const NRP = require("node-redis-pubsub")
const mongoose = require("mongoose")
const logger = require("./lib/logger")
require("dotenv").config()

const { handleUserCreation, handleUserUpdate } = require("./listeners")

async function main() {
  try {
    mongoose.Promise = global.Promise
    mongoose.set("strictQuery", false)
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    logger.info("Connected to Mongo DB via Mongoose 💪")
  } catch (dbConnErr) {
    logger.error(`➡️ Failed to connect to Mongo DB via Mongoose: ${dbConnErr.message}`)
  } finally {
    logger.info("Bridge app connected... ➡️ ")
  }
}
async function redisPubSub() {
  const nrp = new NRP({
    // url: process.env.REDIS_CONNECTION_STRING
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }) // This is the NRP client

  nrp.on("user::create", handleUserCreation)
  nrp.on("user::update", handleUserUpdate)
}

main()
redisPubSub()
