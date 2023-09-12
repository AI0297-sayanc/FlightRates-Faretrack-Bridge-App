const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,  // Flightrates only
  },
  userName: String, // Both used 
  faretrackUserId: Number, // Faretrack only
  faretrackToken: {
    type: String // Faretrack only
  }
})

UserSchema.set("toJSON", { virtuals: true })
UserSchema.set("toObject", { virtuals: true })
UserSchema.set("timestamps", true)

module.exports = mongoose.model("User", UserSchema)
