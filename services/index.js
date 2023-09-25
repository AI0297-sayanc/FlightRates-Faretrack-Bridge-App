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
        return logger.error(`Faretrack login service error: ❎ ${response.status} `)
      }
      const { username: userName, access_token: faretrackToken } = await response.json()
      return { userName, faretrackToken }
    } catch (err) {
      return logger.error(`Faretrack login service error ❎ ${err}`)
    }
  },
  async addMarket(doc, token) {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // eslint-disable-next-line quote-props
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(doc)
      }
      console.log("options ==>", options)
      const response = await fetch(`${url}/addmarket`, options)
      console.log("response ==> ", response.json())
      if (!response.ok) {
        const errorText = await response.json()
        throw new Error(`Faretrack addmarket service error: ❎ ${response.status}, message: ${errorText.Message}`)
      }
      const { Fsid } = await response.json()
      return Fsid
    } catch (err) {
      return logger.error(`Faretrack addmarket service error: ❎ ${err.message}`)
    }
  }
}
