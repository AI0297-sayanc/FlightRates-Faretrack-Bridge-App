const mongoose = require("mongoose")
const CENTRAL_CONN = require("../../../db/central")

const AirlineSchema = new mongoose.Schema({

  sourceName: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  code: {
    type: Number,
    required: true
  },
  designater: String,
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

AirlineSchema.set("toJSON", { virtuals: true })
AirlineSchema.set("toObject", { virtuals: true })
AirlineSchema.set("timestamps", true)

module.exports = CENTRAL_CONN.model("Airline", AirlineSchema)
