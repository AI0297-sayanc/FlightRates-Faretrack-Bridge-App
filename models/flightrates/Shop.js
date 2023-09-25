const mongoose = require("mongoose")

const CENTRAL_CONN = require("../../db/central")
const Airport = require("./references/Airport")
const Source = require("./Source")
const CabinClass = require("./references/Cabinclass")
const Pos = require("./references/Pos")
const Currency = require("./references/Currency")
const User = require("./User")

const ShopSchema = new mongoose.Schema({
  _OD: [
    {
      _flyFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Airport,
      },
      _flyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Airport
      },
    }
  ],
  OD: [String], /* Redundant field */

  _sources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Source
    },
  ],
  _alternateSources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Source
    },
  ],

  isRoundTrip: {
    type: Boolean,
    default: false
  },
  los: Number,

  _cabinClasses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: CabinClass
    },
  ],

  _carriers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Source
    }
  ],
  pax: {
    adults: {
      type: Number,
      required: true
    },
    infants: Number,
    children: Number
  },
  _pos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Pos
  },
  posName: String, // Redundant
  _currency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Currency
  },
  currencyName: String, // Redundant
  horizons: { // Days
    type: [String],
    required: true
  },
  noOfStops: {
    type: String,
    enum: ["0", "1", "2", "3", "3+"],
    default: "0"
  },
  fareType: {
    type: String,
    enum: ["Regular", "Defence", "Doctors", "Senior Citizen", "Students"]
  },
  duration: {
    hour: Number,
    minute: Number
  },
  startDate: Date,

  shopName: { // editable
    type: String,
    required: true
  },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true }, // User id
  userName: String, // Customer Name
  deliveryMode: [{ // editable
    type: String,
    enum: ["webhook", "db"]
  }],

  isDeleted: { // Soft Delete
    type: Boolean,
    default: false
  },

  isActiveStatus: {
    type: Boolean,
    default: true
  },

  _createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    default: null
  },
  _updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    default: null
  },
  vertical: String,
  isCustomerCreated: {
    type: Boolean
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

ShopSchema.set("toJSON", { virtuals: true })
ShopSchema.set("toObject", { virtuals: true })
ShopSchema.set("timestamps", true)

module.exports = CENTRAL_CONN.model("Shop", ShopSchema)
