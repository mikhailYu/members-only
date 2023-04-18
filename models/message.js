const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageScheme = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  text: { type: String, required: true, maxLength: 1000 },
  date: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
});

MessageScheme.virtual("dateFormatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(
    DateTime.DATETIME_SHORT_WITH_SECONDS
  );
});

// Export model
module.exports = mongoose.model("message", MessageScheme);
