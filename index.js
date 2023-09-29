require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const { connectDb } = require("./config/connection/dbconnect");
const { connectToCloudinary } = require("./config/connection/cloudinary");
const { PORT } = require("./config/env/env-vars");

//import routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
//Connect to cloud and db
connectToCloudinary();
connectDb();

//use middlewares
const app = express();
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//mount the routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);

app.listen(PORT || 443, () => {
  console.log("server is up and running at:" + PORT);
});
