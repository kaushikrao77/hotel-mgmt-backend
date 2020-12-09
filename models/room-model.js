let mongoose = require("mongoose");

let RoomSchema = mongoose.Schema({
  id: Number,
  cost: Number,
  totalRooms: Number,
  description: String,
  name: String,
});

module.exports = mongoose.model("Room", RoomSchema);
