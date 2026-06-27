import mongoose from "mongoose";
import connectDB from "./db/index.js";
 
import dotenv from "dotenv";
dotenv.config({path: "./.env"});

connectDB();























// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//     app.on("error", (err) => {
//       console.error("Error connecting to MongoDB:", err);
//       throw err;
//     })
//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT}`);
//     })
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     throw error;
//   }
// }
// )()