const logger = require("../lib/logger")
const url = process.env.API_URL

module.exports = {
  async loginService(doc) {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(doc)
      }
      const response = await fetch(`${url}/authtoken`, options)
      if (!response.ok) {
        return logger.error(`HTTP error! Status: ${response.status} Message: ${response.message}`)
      }
      const { username: userName, access_token: faretrackToken } = await response.json()
      return { userName, faretrackToken }
    } catch (err) {
      return logger.error(`Error ${err}`)
    }
  },
  async addMarket(doc, token) {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${token}`
        },
        body: JSON.stringify(doc)
      }
      const response = await fetch(`${url}/addmarket`, options)
      if (!response.ok) {
        console.log("response ==> ", response)
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      console.log("response ==> ", response)
      const { Fsid } = await response.json()
      return { Fsid }
    } catch (err) {
      return logger.error(`Error ${err}`)
    }
  }
}
