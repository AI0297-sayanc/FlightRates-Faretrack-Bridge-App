const mongoose = require("mongoose")
const CENTRAL_CONN = require("../../../db/central")

const PosSchema = new mongoose.Schema({

  posCode: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  },
  countryName: {
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

PosSchema.set("toJSON", { virtuals: true })
PosSchema.set("toObject", { virtuals: true })
PosSchema.set("timestamps", true)

module.exports = CENTRAL_CONN.model("Pos", PosSchema)
