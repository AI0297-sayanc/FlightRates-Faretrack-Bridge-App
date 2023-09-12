const mongoose = require("mongoose")

const CENTRAL_CONN = require("../../db/central")
const Flightshop = require("./Shop")
const User = require("./User")
const Timezone = require("./references/Timezone")

const ScheduleSchema = new mongoose.Schema({
  scheduleName: {
    type: String,
    require: true
  },
  _shop: {
    type: mongoose.Schema.Types.ObjectId, ref: Flightshop
  },
  _timezone: {
    type: mongoose.Schema.Types.ObjectId, ref: Timezone
  },
  timezoneName: {
    type: String // Reundant Field
  },

  minute: { type: String, default: "*" },
  hour: { type: String, default: "*" },
  dayOfMonth: { type: String, default: "*" },
  month: { type: String, default: "*" },
  dayOfWeek: { type: String, default: "*" },

  isActiveStatus: {
    type: Boolean,
    default: true
  },

  crontabExpression: String, // compute, validate, & set in hooks below

  startDate: String,
  endDate: String,

  _user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true }, // customer Id
  userName: String, // Customer name
  vertical: {
    type: String
  },
  isDeleted: { // Soft Delete
    type: Boolean,
    default: false
  },
  isCustomerCreated: {
    type: Boolean
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

ScheduleSchema.set("toJSON", { virtuals: true })
ScheduleSchema.set("toObject", { virtuals: true })
ScheduleSchema.set("timestamps", true)

module.exports = CENTRAL_CONN.model("Schedule", ScheduleSchema)
