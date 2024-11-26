import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
  token: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Token = mongoose.model("RefreshToken", tokenSchema);

export default Token;
