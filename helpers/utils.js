const crypto = require("crypto");

module.exports.extractExtensionFromString = function (fileName) {
  if (typeof fileName !== "string") return "";
  return fileName.split(".").at(-1);
};

module.exports.generateRandomId = function () {
  return crypto.randomBytes(16).toString("hex");
};
