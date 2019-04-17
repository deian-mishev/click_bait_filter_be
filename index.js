console.log("===========================");
console.log("======= BUILD CHECK =======");
console.log("===========================");
console.log("==== SERVICE ENV VARS =====");
console.log("WF_BE_ADDRESS: " + process.env.WF_BE_ADDRESS);
console.log("PORT: " + process.env.PORT);
console.log("===========================");

const path = require("path");
const axios = require("axios");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const resolvedBase = path.join(`${__dirname}/src`);
const resolvedIndex = path.join(`${__dirname}/src/index.html`);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(resolvedBase));
app.use(cors());

const request_options = req => {
  delete req.headers.origin;
  delete req.headers.referer;
  return {
    method: req.method,
    data: req.body,
    url: `${process.env.WF_BE_ADDRESS}/${req.headers.proxy_url}`,
    headers: req.headers
  };
};

const proxy = (req, frontendResponse) => {
  axios(request_options(req))
    .then(backendResponse => {
      frontendResponse.send(backendResponse.data);
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.error) {
        frontendResponse.send({ error: error.response.data.error });
        return;
      }
      frontendResponse.send(error);
    });
};

app.get("/pageSegmentation", (req, res) => {
  res.send("GET/pageSegmentation");
});

app.post("/position", (req, res) => {
  res.send("POST/position");
});

app.listen(process.env.PORT);

console.log(`Service listening on port ${process.env.PORT}`);
