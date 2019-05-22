console.log("===========================");
console.log("======= BUILD CHECK =======");
console.log("===========================");
console.log("==== SERVICE ENV VARS =====");
console.log("PORT: " + process.env.PORT);
console.log("===========================");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/pageSegmentation/:page", (req, res) => {
  const page = req.params.page;
  // Add segmentation from mongo
  res.send(page);
});

app.post("/link", (req, res) => {
  const params = req.body;
  // Add entry to
  res.send(params);
});

app.use(cors());
app.listen(process.env.PORT);

console.log(`Service listening on port ${process.env.PORT}`);
