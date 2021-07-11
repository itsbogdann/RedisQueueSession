const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;

const SessionSchema = new Schema({
  _id: Types.ObjectId,
  localId: String,
  globalId: String,
  profile: [
    {
      fieldName: String,
      value: Types.Mixed,
    },
  ],
  createdAt: Date,
  lastSeenAt: Date,
  convertedAt: Date,
  companyId: Types.ObjectId,
  workspaceId: Types.ObjectId,
  campaignId: Types.ObjectId,
  campaignVersionId: Types.ObjectId,
});

module.exports = mongoose.model("Session", SessionSchema);
