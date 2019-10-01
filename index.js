console.log("===========================");
console.log("======= BUILD CHECK =======");
console.log("===========================");
console.log("==== SERVICE ENV VARS =====");
console.log("PORT: " + process.env.PORT);
console.log("===========================");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const Websait = require('./mongo/websait');
const User = require('./mongo/user');
const Link = require('./mongo/link');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/pageSegmentation", (req, res) => {
  let data = {};

  // DATA LAYER
  if (req.body.page) {
    const page = extractHostname(req.body.page);
    userLayer[req.body.action] = { [req.body.tabId]: page };
    data = dataLayer[page] || {};
  } else if (userLayer[req.body.action]) {
    const user = userLayer[req.body.action];
    data = dataLayer[user[req.body.tabId]] || {};
  }

  res.send(data);
});

app.post("/link", (req, res) => {
  const params = req.body;
  const domain = extractHostname(params.domain);

  // DATA LAYER
  if (!dataLayer[domain]) dataLayer[domain] = { [params.link]: 0 };
  if (!dataLayer[domain][params.link]) dataLayer[domain][params.link] = 0;

  dataLayer[domain][params.link]++;
  res.send(params);
});

app.use(cors());
app.listen(process.env.PORT);

console.log(`Service listening on port ${process.env.PORT}`);

extractHostname = url => {
  var hostname;
  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  hostname = hostname.split(":")[0];
  hostname = hostname.split("?")[0];
  return hostname;
};

const dataLayer = {};
const userLayer = {};