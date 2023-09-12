const mongoose = require("mongoose")
const CENTRAL_CONN = require("../../../db/central")

const CurrencySchema = new mongoose.Schema({

  iso: {
    type: String,
    required: true
  },
  symbol: {
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

CurrencySchema.set("toJSON", { virtuals: true })
CurrencySchema.set("toObject", { virtuals: true })
CurrencySchema.set("timestamps", true)

module.exports = CENTRAL_CONN.model("Currency", CurrencySchema)
