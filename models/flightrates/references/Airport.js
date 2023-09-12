const mongoose = require("mongoose")
const CENTRAL_CONN = require("../../../db/central")

const AirportSchema = new mongoose.Schema({

  airportName: {
    type: String,
    required: true
  },
  airportCode: { // IATA Code
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },

  /* Delete log for audit */
  deletedBy: {
    what: {
      type: String,
      enum: ["Customer", "Admin"], // needs to be hardcoded, based on which API
    },
    _who: {
      type: mongoose.Schema.Types.ObjectId
    },
    when: {
      type: mongoose.Schema.Types.Date,
    }
  }
})

AirportSchema.set("toJSON", { virtuals: true })
AirportSchema.set("toObject", { virtuals: true })
AirportSchema.set("timestamps", true)

module.exports = CENTRAL_CONN.model("Airport", AirportSchema)
