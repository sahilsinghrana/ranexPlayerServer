const storage = require("cloudinary").v2;

storage.config({
  cloud_name: "sahilwebbuilder",
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

module.exports = storage;
