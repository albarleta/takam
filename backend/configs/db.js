import mongoose from "mongoose";

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to: ${mongoose.connection.name}`);
  } catch (error) {
    console.log("Can't connect to DB ");
    process.exit();
  }
})();
