const express = require("express");
const app = express();
const cloudinary = require("cloudinary");

app.use(express.static("public"));

cloudinary.config({
   cloud_name: "toddles",
   api_key: "464326275517746",
   api_secret: "SGFxqvO4lzuxU8GoBl4rVf7gkZc"
});

// cloudinary.uploader.upload("./public/images/Tom.jpg", function(result) {
//    console.log(result);
// });

const port = process.env.PORT || 4040;

app.listen(port, () => console.log("running on port: ", port));
