const NRP = require("node-redis-pubsub")

require("dotenv").config()

const { handleUserCreation, handleUserUpdate } = require("./listeners")

const nrp = new NRP({
  url: process.env.REDIS_CONNECTION_STRING
}) // This is the NRP client

nrp.on("user::create", handleUserCreation)
nrp.on("user::update", handleUserUpdate)
