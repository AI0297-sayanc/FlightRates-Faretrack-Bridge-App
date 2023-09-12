const mongoose = require("mongoose")
const CENTRAL_CONN = require("../../db/central")

const UserSchema = new mongoose.Schema({

  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },

  userName: {
    type: String,
    // lowercase: true,
    required: true,
    unique: true
  },

  phoneNumber: String,
  lastLoginAt: Date,
  password: {
    type: String,
    required: true
  },

  isActiveStatus: {
    type: Boolean,
    default: true
  },

  name: {
    first: String,
    last: String
  },
  tableauUsername: {
    type: String
  },
  workBook: String,
  targetSite: String,
  isTableau: {
    type: Boolean,
    default: false
  },

  vertical: {
    type: String
  },
  _primaryAirline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Airline",
    required: true
  },
  // competitorSources: Array,
  customerType: {
    type: String,
    enum: ["demo", "subscriber"]
  },
  validTill: {
    type: mongoose.Schema.Types.Date
  },

})

UserSchema.set("toJSON", { virtuals: true })
UserSchema.set("toObject", { virtuals: true })
UserSchema.set("timestamps", true)
UserSchema.set("collection", "customers") // Customer in central connection are users here

module.exports = CENTRAL_CONN.model("User", UserSchema)
