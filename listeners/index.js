const mongoose = require("mongoose")
const User = require("../models/User")
const logger = require("../lib/logger")
const { loginService, addMarket } = require("../services")
const Market = require("../models/Market")
const Shop = require("../models/flightrates/Shop")

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
      return logger.info("Sucessfully LoggedIn !!")
    } catch (err) {
      return logger.error(`Error ${err}`)
    }
  },
  async handleMarket(doc) {
    try {
      const { userName, _shop, _id: _schedule } = doc.data
      const [user, shop] = await Promise.all([
        User.findOne({ userName })
          .sort({ createdAt: -1 })
          .select("userName faretrackToken")
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
          .exec()
      ])
      const docValue = shop._OD.reduce((acc, cur) => [
        {
          ...acc,
          fsid: null,
          editshop: false,
          shopname: shop.shopName,
          flyfrom: cur._flyFrom.airportCode,
          flyto: cur._flyTo.airportCode,
          cabinclass: shop._cabinClasses.map((c) => c.code),
          sources: shop._sources.map((s) => s.code),
          routetype: {
            rt_type: shop.isRoundTrip ? 1 : 0,
            los: shop.los,
            losval: null
          },
          los: shop.los,
          horizon: 1,
          horizon_startday: 0,
          horizon_endday: 0,
          horizon_startdate: null,
          horizon_enddate: null,
          pax: {
            adults: shop.pax.adults,
            infants: shop.pax.infants
          },
          frequency: {
            refresh: "Daily",
            days: [1],
            time: [
              {
                starttime: "03:45 pm",
                timezone: "Africa/Addis_Ababa"
              }
            ],
            startdate: "2023-08-24",
            enddate: "2023-08-24"
          },
          pos: shop._pos.region,
          currency: shop._currency.iso,
          historical_horizon: 30,
          historical_frequency: {
            refresh: "Daily",
            days: [],
            time: [
              {
                starttime: "03:45 pm",
                timezone: "Africa/Abidjan"
              }
            ]
          },
          rateshoptable: false,
          visualizetable: true
        }
      ], [])
      docValue.forEach(async (value) => {
        const marketValue = await addMarket(value, user.faretrackToken)
        const {
          Fsid: fsId
        } = marketValue
        await Market.create({
          faretrackFrequency: value.frequency,
          userName,
          _shop,
          _schedule,
          fsId
        })
      })
      return logger.info("Sucessfully shop and schedule mapped !!")
    } catch (err) {
      return logger.error(`Error ${err}`)
    }
  }
}
