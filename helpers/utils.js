const crypto = require("crypto");

module.exports = function (fileName) {
  if (typeof fileName !== "string") return undefined;
  return fileName.split(".").at(-1);
};

module.exports = function () {
  return crypto.randomBytes(16).toString("hex");
};
