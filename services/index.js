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
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const { username: userName, access_token: faretrackToken } = await response.json()
      return { userName, faretrackToken }
    } catch (err) {
      throw new Error(`Error ${err}`)
    }
  }
}
