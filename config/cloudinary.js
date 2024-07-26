const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "sahilwebbuilder",
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

const storage = cloudinary;
module.exports = storage;
