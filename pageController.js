const { Parser } = require("json2csv");
const pageScraper = require("./pageScrapper");
const fs = require("fs");
const csvJSON = require("./csvJson");
const parse = require("csv-parse");
const https = require("https");

async function scrapeAll(browserInstance, object) {
  let browser;
  const data = require("fs").readFileSync("./entreprises.json", "utf8");
  const parsedData = JSON.parse(data);
  const dataSpliced = parsedData.slice(
    parseInt(object[0]),
    parseInt(object[1])
  );
  const crashedName = `crashed${object[0]}${object[1]}`;
  const urls = dataSpliced.map((url) => {
    return {
      url: url["Site web"],
      name: url["Nom entreprise"],
      siren: url.Siren,
    };
  });
  browser = await browserInstance;
  let crashedData = [];
  const pagePromise = async (data) => {
    const fileName = `${data.siren}-${data.name}`;
    console.log(`scrapping ${fileName}`);
    const page = await browser.newPage();
    await page.waitForTimeout(1000);
    try {
      await page.click("#tarteaucitronPersonalize2");
    } catch (err) {}
    await page.goto(data.url, {
      waitUntil: "networkidle2",
    });
    try {
      const fileUri = await page.$eval(
        `a[title="Url certificat"]`,
        (file) => file.href
      );
      https.get(fileUri, (res) => {
        const stream = fs.createWriteStream(`./pdfs/${fileName}.pdf`);
        res.pipe(stream);
        stream.on("finish", () => {
          console.log(`scrapped ${fileName}`);
          stream.close();
        });
      });
    } catch (err) {
      crashedData.push(data);
      console.log(err);
    }

    await page.close();
  };
  for (link in urls) {
    await pagePromise(urls[link]);
  }
  const stringCrashed = JSON.stringify(crashedData);
  fs.writeFile(`./crash/${crashedName}.json`, stringCrashed, (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
}

module.exports = (browserInstance, object) =>
  scrapeAll(browserInstance, object);
