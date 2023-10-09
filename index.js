const NRP = require("node-redis-pubsub")
const mongoose = require("mongoose")
const logger = require("./lib/logger")
require("dotenv").config()

const { handleLogin, handleMarket } = require("./listeners")

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
  const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
  if (![null, undefined, ""].includes(process.env.REDIS_PASS)) redisConfig.auth = process.env.REDIS_PASS

  const nrp = new NRP(redisConfig) // This is the NRP client

  nrp.on("user::login", handleLogin)
  nrp.on("schedule::create", handleMarket)
}

main()
redisPubSub()
