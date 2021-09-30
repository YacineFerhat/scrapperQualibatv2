const path = require("path");

const scraperObject = {
  url: "https://www.qualibat.com/maitre-douvrage/",
  async scraper(browser, urls) {
    const fullJson = [];
    let page = await browser.newPage();
    const downloadPath = path.resolve("./pdfs");
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

    let scrapedData = [];
    async function scrapeCurrentPage() {
      let pagePromise = (data) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let newPage = await browser.newPage();
          await newPage.goto(data.url);

          await page._client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath: downloadPath,
          });
          let test;
          try {
            test = await newPage.$eval(
              ".right-particulier-formblock > .titleblock >  p > strong",
              (text) => text.textContent
            );
          } catch (err) {
            test = "Not found";
          }
          console.log("test", test);
          const fileUrl = await page.$eval(
            '.right-particulier-formblock >  .insideblock > div > .account-single > .right-col > .certifs > .certificat-qualibat > p > a',
            (file) => file.href
          );
        
          const fileName = `${data.Siren}-${data.name}`;
          https.get(fileUrl, (res) => {
            const stream = fs.createWriteStream(`./pdfs/${fileName}.pdf`);
            res.pipe(stream);
            stream.on("finish", () => {
              stream.close();
            });
          });
          resolve(dataObj);
          await newPage.close();
        });

      for (link in urls) {
        let currentPageData = await pagePromise(urls[link]);
        scrapedData.push(currentPageData);
      }
      await page.close();
      return scrapedData;
    }
    let data = await scrapeCurrentPage();
    return data;
  },
};

module.exports = scraperObject;
