const cuid = require("cuid")
const User = require("../models/User")
const logger = require("../lib/logger")
const { loginService, addMarket } = require("../services")
const Market = require("../models/Market")
const Shop = require("../models/flightrates/Shop")
const { horizonDateConverter, scheduleConvert } = require("../lib")

module.exports = {
  async handleLogin(doc) {
    try {
      const { handle: username, password, isTablueUser } = doc.data
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
        isTablueUser
      })
      return logger.info("Sucessfully LoggedIn !!")
    } catch (err) {
      return logger.error(`Error ${err}`)
    }
  },
  async handleMarket(doc) {
    try {
      const { userName, _shop, _id: _schedule } = doc.data
      if (!userName || !_shop || !_schedule) return logger.error("Malformed payload !")
      const [user, shop] = await Promise.all([
        User.findOne({ userName })
          .sort({ createdAt: -1 })
          .select("userName faretrackToken isTablueUser")
          .exec(),
        Shop.findOne({
          _id: _shop,
          userName,
          isActiveStatus: { $ne: false },
          isDeleted: { $ne: true }
        })
          .populate({
            path: "_OD._flyFrom", select: "-isDeleted -_createdBy -_updatedBy -__v", isDeleted: { $eq: false }
          })
          .populate({
            path: "_OD._flyTo", select: "-isDeleted -_createdBy -_updatedBy -__v", isDeleted: { $eq: false }
          })
          .populate({
            path: "_sources", select: "-isDeleted -_createdBy -_updatedBy -__v", options: { sort: { _id: -1 } }, isDeleted: { $eq: false }
          })
          .populate({
            path: "_alternateSources", select: "-isDeleted -_createdBy -_updatedBy -__v", options: { sort: { _id: -1 } }, isDeleted: { $eq: false }
          })
          .populate({
            path: "_pos", select: "-isDeleted -_createdBy -_updatedBy -__v", options: { sort: { _id: -1 } }, isDeleted: { $eq: false }
          })
          .populate({
            path: "_currency", select: "-isDeleted -_createdBy -_updatedBy -__v", options: { sort: { _id: -1 } }, isDeleted: { $eq: false }
          })
          .populate({
            path: "_cabinClasses", select: "-isDeleted -_createdBy -_updatedBy -__v", options: { sort: { _id: -1 } }, isDeleted: { $eq: false }
          })
          .populate({
            path: "_carriers", select: "-isDeleted -_createdBy -_updatedBy -__v", options: { sort: { _id: -1 } }, isDeleted: { $eq: false }
          })
          .exec()
      ])
      if (user === null) return logger.error("Invaild user !")
      if (shop === null) return logger.error("Invaild shop !")
      if (!user.faretrackToken) return logger.error("Faretracktoken not found !!")
      const dateRange = await horizonDateConverter(shop.horizons, "DATE_RANGE")
      const docValue = await shop._OD.reduce(async (accPromise, cur) => {
        try {
          const acc = await accPromise
          const carriers = shop?._carriers.map((c) => +c.code)
          const cabinclass = shop?._cabinClasses.map((c) => c.code)
          const sources = shop?._sources?.map((s) => +s.code)
          return [
            ...acc,
            {
              fsid: null,
              editshop: false,
              shopname: `${shop?.shopName}_${cuid.slug()}`,
              flyfrom: cur?._flyFrom?.airportCode,
              flyto: cur?._flyTo?.airportCode,
              carriers,
              cabinclass,
              sources,
              routetype: {
                rt_type: shop.isRoundTrip ? 2 : 1,
                los: shop.los !== 0 ? [shop.los] : null,
                losval: shop.los !== 0 ? shop.los : null
              },
              los: null,
              horizon: await horizonDateConverter(shop.horizons, "ONLY_SINGLE_DAY"),
              horizon_days: await horizonDateConverter(shop.horizons, "DAY_RANGE"),
              horizon_startday: 0,
              horizon_endday: 0,
              horizon_startdate: dateRange.startDate,
              horizon_enddate: dateRange.endDate,
              pax: {
                adults: shop.pax.adults,
                infants: shop.pax.infants
              },
              frequency: {
                refresh: await scheduleConvert(doc.data.crontabExpression, "REFERSH"),
                days: await scheduleConvert(doc.data.crontabExpression, "DAYS"),
                time: [
                  {
                    starttime: await scheduleConvert(doc.data.crontabExpression, "STARTTIME"), // Pending ask murali
                    timezone: doc.data.timezoneName
                  }
                ],
                startdate: doc.data.startDate,
                enddate: doc.data.endDate
              },
              pos: shop._pos.region,
              currency: shop?._currency?.iso,
              historical_horizon: 0,
              historical_frequency: null,
              rateshoptable: false,
              visualizetable: user.isTablueUser
            }
          ]
        } catch (error) {
          return logger.error(error)
        }
      }, Promise.resolve([]))
      const marketArr = []
      // eslint-disable-next-line no-restricted-syntax
      for (const value of docValue) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const Fsid = await addMarket(value, user.faretrackToken)
          if (!Fsid) logger.error("Fsid not found !")
          marketArr.push({
            faretrackFrequency: value.frequency,
            userName,
            _shop,
            _schedule,
            fsId: Fsid
          })
        } catch (error) {
          logger.error(`Error ${error}`)
        }
      }
      await Market.insertMany(marketArr)
      return logger.info("Sucessfully shop and schedule mapped !!")
    } catch (err) {
      return logger.error(`Error ${err}`)
    }
  }
}
