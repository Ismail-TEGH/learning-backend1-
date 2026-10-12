 import express from "express";
 import cors from "cors";
 import cookieParser from "cookie-parser";

 const app = express();

app.use(cors( 
    {
        origin: process.env.CORS_ORIGIN || "8000",
        credentials: true,
    }
));
app.use(express.json({limt: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
 

import userRoutes from "./routes/user.routes.js";
// app.get("/", (req, res) => {
//     console.log("Root route hit");
//     res.send("Server is working");
// });
//routes declration 
app.use("/api/v1/users", userRoutes);



 export default app;