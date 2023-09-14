const logger = require("./logger")
const moment = require("moment")

async function momentDateVaild(val, format) {
  let isVaild = false
  const value = moment(val, format, true)
  if (value.isValid()) {
    isVaild = true
    return isVaild
  }
  return isVaild
}

module.exports = {
  async horizonDateConverter(doc, pattern) {
    try {
      if (pattern === "ONLY_SINGLE_DAY") {
        const value = doc.map((d) => {
          // eslint-disable-next-line no-restricted-globals
          if (!isNaN(d)) {
            return d
          }
          return 0
        })
        return parseInt(value[0], 10)
      } if (pattern === "DAY_RANGE") {
        const value = doc.map((d) => {
          // eslint-disable-next-line no-restricted-globals
          if (typeof d === "string" && d.includes("-") === true && isNaN(d.split("-")[0]) === false && isNaN(d.split("-")[1]) === false) {
            return d
          }
          return null
        })
        const result = value[0] === null ? null : value
        return result
      }
      if (pattern === "DATE_RANGE") {
        const value = doc.map(async (d) => {
          if (typeof d === "string" && d.includes("-") === true) {
            const sDate = await momentDateVaild(d.split("-")[0], "DD/MM/YYYY")
            const eDate = await momentDateVaild(d.split("-")[1], "DD/MM/YYYY")
            if (sDate === true && eDate === true) {
              const startDate = moment(d.split("-")[0], "DD/MM/YYYY").format("YYYY-MM-DD")
              const endDate = moment(d.split("-")[1], "DD/MM/YYYY").format("YYYY-MM-DD")
              return { startDate, endDate }
            }
            return { startDate: null, endDate: null }
          }
          const oDate = await momentDateVaild(d, "DD/MM/YYYY")
          if (oDate) {
            const date = moment(d, "DD/MM/YYYY").format("YYYY-MM-DD")
            return { startDate: date, endDate: date }
          }
          return { startDate: null, endDate: null }
        })
        return value[0]
      }
      return null
    } catch (err) {
      return logger.error(`Error ${err}`)
    }
  },
}
