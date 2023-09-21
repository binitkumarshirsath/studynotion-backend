require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const { connectToCloudinary } = require("./config/connection/cloudinary");
const { PORT } = require("./config/env/env-vars");

connectToCloudinary();

const app = express();
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.listen(PORT, () => {
  console.log("server is up and running at:" + PORT);
});
