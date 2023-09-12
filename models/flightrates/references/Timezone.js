const mongoose = require("mongoose")
const CENTRAL_CONN = require("../../../db/central")

const TimezoneSchema = new mongoose.Schema({

  countryCode: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    required: true
  },
  countryName: {
    type: String,
    required: true
  },
  gmtOffSet: {
    type: String,
    required: true
  },
  abbr: {
    type: String,
    required: true
  },
  isActiveStatus: { // Active Status
    type: Boolean,
    default: true
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

TimezoneSchema.set("toJSON", { virtuals: true })
TimezoneSchema.set("toObject", { virtuals: true })
TimezoneSchema.set("timestamps", true)

module.exports = CENTRAL_CONN.model("Timezone", TimezoneSchema)
