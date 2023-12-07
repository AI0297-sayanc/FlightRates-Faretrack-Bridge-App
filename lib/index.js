const moment = require("moment")
const logger = require("./logger")

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

  async horizonDayConverterOnlyForArry(doc, pattern) {
    if (pattern === "MULTIPLE_SINGLE_DAY" && doc.length > 1) {
      const arr = []
      let stg = ""
      // eslint-disable-next-line no-const-assign, no-unreachable-loop
      for (let i = 0; i < doc.length; i++) {
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(doc[i])) {
          if (i === 0) {
            stg = `${doc[i]}`
          } else {
            stg = `${stg},${doc[i]}`
          }
        } else {
          return []
        }
      }
      arr.push(stg)
      console.log("stg ==> ", stg)
      return arr
    }
    if (pattern === "DAY_RANGE") {
      const value = doc.map((d) => {
        // eslint-disable-next-line no-restricted-globals
        if (typeof d === "string" && d.includes("-") === true && isNaN(d.split("-")[0]) === false && isNaN(d.split("-")[1]) === false) {
          return d
        }
        return null
      })
      const result = value[0] === null ? [] : value
      return result
    }
    return []
  },

  async horizonDateConverter(doc, pattern) {
    try {
      if (pattern === "ONLY_SINGLE_DAY" && doc.length === 1) {
        const value = doc.map((d) => {
          // eslint-disable-next-line no-restricted-globals
          if (!isNaN(d)) {
            return d
          }
          return 0
        })
        return parseInt(value[0], 10)
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
  async scheduleConvert(doc, pattern) {
    try {
      const docVal = doc.split(" ")
      if (pattern === "STARTTIME") {
        let hour = docVal[1]
        let minute = docVal[0]
        /* eslint-disable */
        if (isNaN(docVal[1], 10)) {
          hour = "00"
        }
        if (isNaN(docVal[0], 10)) {
          minute = "00"
        }
        return `${hour}:${minute}`
      }
      /* eslint-enable */
      /* Common attributes */
      let refershPattern = "Custom"
      if (docVal[2] === "*" && docVal[3] === "*" && docVal[4] === "*") {
        refershPattern = "Daily"
      }
      if (docVal[2] === "*" && docVal[3] === "*" && docVal[4] !== "*") {
        refershPattern = "Weekly"
      }
      if (docVal[2] !== "*" && docVal[3] === "*") {
        refershPattern = "Monthly"
      }
      /* Common attributes */
      /* Pattern wise */
      if (pattern === "REFERSH") {
        return refershPattern
      }
      if (refershPattern === "Weekly" && pattern === "DAYS") {
        let weeks = []
        if (docVal[4].includes(",")) {
          weeks = docVal[4].split(",")
          weeks = weeks.map((week) => +week)
          return weeks
        }
        if (docVal[4].includes("-")) {
          const weekLength = docVal[4].split("-")
          const high = +weekLength[1]
          const low = +weekLength[0]
          // eslint-disable-next-line no-plusplus
          for (let i = low; i <= high; i++) {
            weeks.push(i)
          }
          return weeks
        }
        return weeks
      }
      if (refershPattern === "Monthly" && pattern === "DAYS") {
        let monthly = []
        if (docVal[2].includes(",")) {
          monthly = docVal[2].split(",")
          monthly = monthly.map((month) => +month)
          return monthly
        }
        if (docVal[2].includes("-")) {
          const weekLength = docVal[2].split("-")
          const high = +weekLength[1]
          const low = +weekLength[0]
          // eslint-disable-next-line no-plusplus
          for (let i = low; i <= high; i++) {
            monthly.push(i)
          }
          return monthly
        }
      }
      return []
    } catch (err) {
      return logger.error(`Error ${err}`)
    }
  },
}
