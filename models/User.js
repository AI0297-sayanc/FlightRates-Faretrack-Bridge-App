const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId, // Flightrates only
  },
  isTablueUser: { // Both
    type: Boolean
  },
  userName: String, // Both used
  faretrackUserId: Number, // Faretrack only
  faretrackToken: {
    type: String // Faretrack only
  }
})

UserSchema.pre("validate", async function (next) {
  const decoded = jwt.decode(this.faretrackToken)
  this.faretrackUserId = decoded.uid
  return next()
  // this.faretrackUserId = const decoded = jwt.decode(token);
})

UserSchema.set("toJSON", { virtuals: true })
UserSchema.set("toObject", { virtuals: true })
UserSchema.set("timestamps", true)

module.exports = mongoose.model("User", UserSchema)
