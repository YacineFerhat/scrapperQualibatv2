const express = require("express");
const app = express();
const port = 8080;
const browserObject = require("./browser");
const scraperController = require("./pageController");
const pdfExtractor = require("./pdfController");
const converter = require("./jsonConverter");

app.get("/upload/:object", (req, res) => {
  const { object } = req.params;
  const objectSplitted = object.split("_");
  if (object !== undefined) {
    let browserInstance = browserObject.startBrowser();
    scraperController(browserInstance, objectSplitted);
  }
});

app.get("/pdfExtractor", (req, res) => {
  pdfExtractor();
});

app.get("/convert", (req, res) => {
  jsonConvert();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/test", (req, res) => {
  console.log("hello");
});
