const express = require("express");
const app = express();
const port = 8080;
const browserObject = require("./browser");
const scraperController = require("./pageController");

app.get("/upload/:object", (req, res) => {
  const { object } = req.params;
  const objectSplitted = object.split('_')
  if (object !== undefined) {
    let browserInstance = browserObject.startBrowser();
    scraperController(browserInstance, objectSplitted);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
