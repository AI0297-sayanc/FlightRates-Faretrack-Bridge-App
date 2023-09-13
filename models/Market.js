const mongoose = require("mongoose")

const MarketSchema = new mongoose.Schema({
  _shop: {
    type: mongoose.Schema.Types.ObjectId, // Flightrates only
  },
  _schedule: {
    type: mongoose.Schema.Types.ObjectId // Flightrates only
  },
  fsId: Number, // Faretrack only,
  userName: String, // Both used
  faretrackFrequency: {
    refresh: String,
    days: [Number],
    time: [{
      starttime: String,
      timezone: String
    }],
    startdate: String,
    enddate: String
  }
})

MarketSchema.set("toJSON", { virtuals: true })
MarketSchema.set("toObject", { virtuals: true })
MarketSchema.set("timestamps", true)

module.exports = mongoose.model("Market", MarketSchema)
