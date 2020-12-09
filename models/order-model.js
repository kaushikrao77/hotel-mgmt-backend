let mongoose = require("mongoose");

let OrderSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  date: [{ type: String }],
  email: String,
  roomId: Number,
  firstName: String,
  lastName: String,
});

module.exports = mongoose.model("Order", OrderSchema);
