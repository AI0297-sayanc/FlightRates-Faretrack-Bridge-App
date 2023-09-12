const mongoose = require("mongoose")
const CENTRAL_CONN = require("../../../db/central")

const CabinClassSchema = new mongoose.Schema({

  code: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
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

CabinClassSchema.set("toJSON", { virtuals: true })
CabinClassSchema.set("toObject", { virtuals: true })
CabinClassSchema.set("timestamps", true)

module.exports = CENTRAL_CONN.model("CabinClass", CabinClassSchema)
