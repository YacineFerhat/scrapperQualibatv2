//const { Parser } = require("json2csv");
//const pageScraper = require("./pageScraper");
const fs = require("fs");
const csvJSON = require("./csvJson");
const parse = require("csv-parse");
const pageScraper = require("./pageScrapper");

const fields = [
  "Nom entreprise",
  "Site web",
  "Adresse",
  "Telephone",
  "Email",
  "Siren",
  "Siret",
  "Effectif",
  "Chiffre d'affaires",
  "Département",
  "Groupe",
];

async function scrapeAll(browserInstance) {
  let browser;
  const data = require("fs").readFileSync("./file.csv", "utf8");
  const jsonObject = csvJSON(data);
  const cleanedData = jsonObject.map((object) => {
    return {
      Groupe: object["Groupe\r"],
      Département: object["Département"],
      url: object["Site web"],
    };
  });
  browser = await browserInstance;
  const fullData = await pageScraper.scraper(browser, cleanedData);
  console.log(fullData);
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
