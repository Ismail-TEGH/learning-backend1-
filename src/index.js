import mongoose from "mongoose";
import connectDB from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({path: "./.env"});

connectDB()
.then(() => {
   app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
        const url = `http://localhost:${process.env.PORT || 8000}`;
       console.log(`Server is running at: ${url}`);
   })
}
 
)
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
  process.exit(1); // Exit the process with an error code
})























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