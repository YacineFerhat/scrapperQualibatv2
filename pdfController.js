const fs = require("fs");
const pdf = require("pdf-parse");
const pdfFolder = "./new/";

async function extractAll() {
  const data = [];
  fs.readdir(pdfFolder, async (err, files) => {
    let ExtractData = async (fileName) => {
      try {
        console.log(fileName);
        let dataBuffer = fs.readFileSync(`${pdfFolder}${fileName}`);
        const { text } = await pdf(dataBuffer);
        const textSplitted = text.split("\n");

        textSplitted.shift();
        textSplitted.shift();

        const hasWebsite = textSplitted[4].includes("www") ? +1 : 0;

        // const adresseLength;
        const has3linesAdresse =
          textSplitted[7 + hasWebsite].charAt(0) !== "0" ? 1 : 0;

        const hasSecondNumber = textSplitted[
          8 + hasWebsite + has3linesAdresse
        ].includes("0")
          ? +1
          : 0;
        const typoRc = textSplitted[
          9 + hasSecondNumber + hasWebsite + has3linesAdresse
        ].includes("DEPUIS")
          ? 1
          : 0;

        const hasCaisseCongés = textSplitted[
          12 + hasSecondNumber + has3linesAdresse + typoRc
        ].includes("jour au")
          ? -1
          : 0;

        const hasSomethingMore = textSplitted[
          46 +
            hasCaisseCongés +
            hasSecondNumber +
            hasWebsite +
            has3linesAdresse +
            typoRc
        ].includes("Tranche")
          ? 1
          : 0;

        const loop = textSplitted[
          59 +
            hasCaisseCongés +
            hasSecondNumber +
            hasWebsite +
            has3linesAdresse +
            typoRc +
            hasSomethingMore
        ].includes("* ou du plus")
          ? 1
          : textSplitted[
              60 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc +
                hasSomethingMore
            ].includes("* ou du plus")
          ? 2
          : textSplitted[
              61 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc +
                hasSomethingMore
            ].includes("* ou du plus")
          ? 3
          : textSplitted[
              62 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc +
                hasSomethingMore
            ].includes("* ou du plus")
          ? 4
          : textSplitted[
              63 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc +
                hasSomethingMore
            ].includes("* ou du plus")
          ? 5
          : 6;

        const objectToUse = {
          numero: textSplitted[0],
          validite: textSplitted[1],
          nom_entreprise: textSplitted[2],
          dirigeant: textSplitted[3],
          email: textSplitted[4 + hasWebsite],
          adresse: `${textSplitted[5 + hasWebsite]} ${
            textSplitted[6 + hasWebsite]
          }`,
          telephone_portable: textSplitted[
            7 + hasWebsite + has3linesAdresse
          ].slice(0, 14),
          fax: textSplitted[7 + hasWebsite + has3linesAdresse].slice(14, 28),
          forme_juridique:
            textSplitted[8 + hasSecondNumber + hasWebsite + has3linesAdresse],
          registre_commerce:
            textSplitted[9 + hasSecondNumber + hasWebsite + has3linesAdresse],
          caisse_conges:
            hasCaisseCongés === 0
              ? textSplitted[
                  10 + hasSecondNumber + typoRc + hasWebsite + has3linesAdresse
                ]
              : "",
          assurance_travaux:
            textSplitted[
              11 +
                hasCaisseCongés +
                hasSecondNumber +
                typoRc +
                hasWebsite +
                has3linesAdresse
            ],
          assurance_civile:
            textSplitted[
              12 +
                hasCaisseCongés +
                hasSecondNumber +
                typoRc +
                hasWebsite +
                has3linesAdresse
            ],
          situation_fiscale:
            textSplitted[
              13 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc
            ],
          date_creation:
            textSplitted[
              14 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc
            ],
          capital:
            textSplitted[
              15 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc
            ],
          siren:
            textSplitted[
              16 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc
            ],
          siret: `${
            textSplitted[
              16 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc
            ]
          }${
            textSplitted[
              37 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc
            ]
          }`,
          code_nace:
            textSplitted[
              17 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc
            ],

          edite: textSplitted[
            34 +
              hasCaisseCongés +
              hasSecondNumber +
              hasWebsite +
              has3linesAdresse +
              typoRc
          ].replace("ÉDITÉ LE", ""),
          chiffre_affaire:
            textSplitted[
              46 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc +
                hasSomethingMore
            ],
          tranche_classification:
            textSplitted[
              48 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc +
                hasSomethingMore
            ],
          effectif:
            textSplitted[
              50 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc +
                hasSomethingMore
            ],
          site_internet: hasWebsite !== 0 ? textSplitted[4] : "",
          classification:
            textSplitted[
              44 +
                hasCaisseCongés +
                hasSecondNumber +
                hasWebsite +
                has3linesAdresse +
                typoRc +
                hasSomethingMore
            ],
          //
          qualification:
            loop === 1
              ? [
                  {
                    code: textSplitted[
                      58 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      58 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        58 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },
                ]
              : loop === 2
              ? [
                  {
                    code: textSplitted[
                      58 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      58 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        58 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },
                  {
                    code: textSplitted[
                      59 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      59 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        59 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },
                ]
              : loop === 3
              ? [
                  {
                    code: textSplitted[
                      58 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      58 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        58 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },
                  {
                    code: textSplitted[
                      59 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      59 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        59 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },
                  {
                    code: textSplitted[
                      60 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      60 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        60 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },
                ]
              : loop === 4
              ? [
                  {
                    code: textSplitted[
                      58 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      58 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        58 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },
                  {
                    code: textSplitted[
                      59 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      59 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        59 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },
                  {
                    code: textSplitted[
                      60 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      60 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        60 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },

                  {
                    code: textSplitted[
                      61 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      61 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        61 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },
                ]
              : [
                  {
                    code: textSplitted[
                      58 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      58 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        58 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },
                  {
                    code: textSplitted[
                      59 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      59 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        59 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },
                  {
                    code: textSplitted[
                      60 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      60 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        60 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },

                  {
                    code: textSplitted[
                      61 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      61 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        61 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },

                  {
                    code: textSplitted[
                      62 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(0, 4),
                    nom: textSplitted[
                      62 +
                        hasCaisseCongés +
                        hasSecondNumber +
                        hasWebsite +
                        has3linesAdresse +
                        typoRc +
                        hasSomethingMore
                    ].slice(4, -12),
                    effectif:
                      textSplitted[
                        50 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ],
                    date_attribution:
                      textSplitted[
                        62 +
                          hasCaisseCongés +
                          hasSecondNumber +
                          hasWebsite +
                          has3linesAdresse +
                          typoRc +
                          hasSomethingMore
                      ].slice(-10),
                  },
                ],
        };
        return objectToUse;
      } catch (err) {
        console.log(err);
      }
    };
    for (file in files) {
      let tempData = await ExtractData(files[file]);
      data.push(tempData);
      const stringCrashed = JSON.stringify(data);
      fs.writeFile(`./results/result.json`, stringCrashed, (err) => {
        if (err) {
          throw err;
        }
        console.log("JSON data is saved.");
      });
    }
  });
  return data;
}

module.exports = () => extractAll();
//const splicedArray = flatArray.filter((item) => !wordToDelete.includes(item));
