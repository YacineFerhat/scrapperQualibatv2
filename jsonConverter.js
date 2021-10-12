const { Parser } = require("json2csv");
const fs = require("fs");

const fields = [
    "numero",
    "validite",
    "nom_entreprise",
    "dirigeant",
    "email",
    "adresse",
    "telephone_portable",
    "fax",
    "forme_juridique",
    "registre_commerce",
    "caisse_conges",
    "assurance_travaux",
    "assurance_civile",
    "situation_fiscale",
    "date_creation",
    "capital",
    "siren",
    "siret",
    "code_nace",
    "edite",
    "chiffre_affaire",
    "tranche_classification",
    "effectif",
    "site_internet",
    "classification",
    "qualification": [
        {
          "code": "1161",
          "nom": "Travaux de curage",
          "effectif": "17",
          "date_attribution": "09/02/2021"
        }
      ]
  ];

async function convertAll() {}
module.exports = () => extractAll();
