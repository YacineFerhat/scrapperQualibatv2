function csvJSON(csv) {
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const obj = {};
    const currentline = lines[i].match(/"[^"]*"|[^,]+/g);

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]?.replace('"','')?.replace('"','')] = currentline[j]?.replace('"','')?.replace('"','');
    }
    result.push(obj);
  }
  return result;
}

module.exports = (csv) => csvJSON(csv);
