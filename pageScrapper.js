const scraperObject = {
  url: "https://www.qualibat.com/maitre-douvrage/",
  async scraper(browser, data) {
    const fullJson = [];
    let page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(this.url, {
      waitUntil: "load",
      timeout: 0,
    });
    await page.waitForTimeout(2000);
    try {
      await page.click("#tarteaucitronPersonalize2");
    } catch (err) {
      console.log("Cookie already enabled");
    }
    async function scrapeCurrentPage() {
      let scrapedData = [];
      let pagePromise = (link) => {
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let newPage = await browser.newPage();
          await newPage.goto(link.url);

          try {
            dataObj["Nom entreprise"] = await newPage.$eval(
              ".right-particulier-formblock > .titleblock >  p > strong",
              (text) => text.textContent
            );
          } catch (err) {
            dataObj["Nom entreprise"] = "Not found";
          }

          dataObj["Site web"] = link.url;

          try {
            dataObj["Adresse"] = await newPage.$eval(
              ".right-particulier-formblock > .insideblock > div > .account-single > .left-col > div.block:nth-of-type(6) > p:nth-of-type(1)",
              (text) => text.textContent.slice(10)
            );
          } catch (err) {
            dataObj["Adresse"] = "Not found";
          }

          try {
            dataObj["Telephone"] = await newPage.$eval(
              ".right-particulier-formblock > .insideblock > div > .account-single > .left-col > div.block:nth-of-type(6) > p:nth-of-type(2)",
              (text) =>
                text.textContent
                  .slice(13)
                  .replace(" ", "")
                  .replace(" ", "")
                  .replace(" ", "")
                  .replace(" ", "")
            );
          } catch (err) {
            dataObj["Telephone"] = "Not found";
          }

          try {
            dataObj["Email"] = await newPage.$eval(
              ".right-particulier-formblock > .insideblock > div > .account-single > .left-col > div.block:nth-of-type(6) > p:nth-of-type(3)",
              (text) => text.textContent.slice(7)
            );
          } catch (err) {
            dataObj["Email"] = "Not found";
          }

          try {
            dataObj["Siren"] = await newPage.$eval(
              ".right-particulier-formblock > .insideblock > div > .account-single > .left-col > div.block:nth-of-type(2) > p:nth-of-type(1)",
              (text) => text.textContent.slice(0, -4)
            );
          } catch (err) {
            dataObj["Siren"] = "Not found";
          }

          try {
            dataObj["Siret"] = await newPage.$eval(
              ".right-particulier-formblock > .insideblock > div > .account-single > .left-col > div.block:nth-of-type(2) > p:nth-of-type(1)",
              (text) => text.textContent
            );
          } catch (err) {
            dataObj["Siret"] = "Not found";
          }

          try {
            dataObj["Effectif"] = await newPage.$eval(
              ".right-particulier-formblock > .insideblock > div > .account-single > .left-col > div.block:nth-of-type(5) > p:nth-of-type(1)",
              (text) => text.textContent.slice(0, -9)
            );
          } catch (err) {
            dataObj["Effectif"] = "Not found";
          }

          try {
            dataObj["Chiffre d'affaires"] = await newPage.$eval(
              ".right-particulier-formblock > .insideblock > div > .account-single > .left-col > div.block:nth-of-type(4) > p:nth-of-type(1)",
              (text) => {
                let isMilion = text.textContent.includes("millions euros")
                  ? true
                  : false;
                let textToShow = isMilion
                  ? text.textContent.slice(0, -14)
                  : text.textContent.slice(0, -6);

                ("245 888 euros");
                let textWithoutComma = textToShow;
                textWithoutComma = isMilion
                  ? parseFloat(textWithoutComma.replace(",", ".")) * 1000000
                  : parseFloat(textWithoutComma.replace(" ", ""));
                return textWithoutComma;
              }
            );
          } catch (err) {
            dataObj["Chiffre d'affaires"] = "Not found";
          }

          try {
            dataObj["Dirigeant"] = await newPage.$eval(
              ".right-particulier-formblock > .insideblock > div > .account-single > .left-col > div.block:nth-of-type(1) > p:nth-of-type(1)",
              (text) => text.textContent
            );
          } catch (err) {
            dataObj["Dirigeant"] = "Not found";
          }

          try {
            dataObj["Date de création"] = await newPage.$eval(
              ".right-particulier-formblock > .insideblock > div > .account-single > .left-col > div.block:nth-of-type(3) > p:nth-of-type(1)",
              (text) => text.textContent
            );
          } catch (err) {
            dataObj["Dirigeant"] = "Not found";
          }
          dataObj["Groupe"] = link.Groupe;
          dataObj["Département"] = link["Département"];
          resolve(dataObj);
          await newPage.close();
        });
      };

      for (link in data) {
        let currentPageData = await pagePromise(data[link]);
        scrapedData.push(currentPageData);
      }
      return scrapedData;
    }
    let jsonData = await scrapeCurrentPage();
    return jsonData;
  },
};

module.exports = scraperObject;
