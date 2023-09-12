const User = require("../models/User")
const logger = require("../lib/logger")
const { loginService } = require("../services")

module.exports = {
  async handleLogin(doc) {
    try {
      const { handle: username, password } = doc.data
      const {
        userName,
        faretrackToken
      } = await loginService({
        username,
        password,
        grant_type: "password"
      })
      await User.create({
        userName,
        faretrackToken,
      })
      logger.info("Sucessfully LoggedIn !!")
    } catch (err) {
      throw new Error(`Error ${err}`)
    }
  }
}
