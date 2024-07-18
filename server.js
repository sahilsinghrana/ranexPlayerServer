require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes/index.js");

const port = process.env.PORT || 3000;
const app = express();

BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(routes);

app.listen(port, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("running on port:", port);
});
