process.chdir(__dirname);

const fs = require('fs');
const htmlparser = require('node-html-parser');
const Papa = require('papaparse');

const nameToLodestoneId = {};
for (const filename of fs.readdirSync('./pages/')) {
  const html = fs.readFileSync('./pages/' + filename, 'utf8');
  const root = htmlparser.parse(html);
  const links = root.querySelectorAll('.db-table__txt--detail_link');
  for (const link of links) {
    const url = link.getAttribute('href');
    const id = /^\/lodestone\/playguide\/db\/item\/([^\/]+)\/$/.exec(url)[1];
    if (link.childNodes.length !== 1) debugger;
    const name = link.firstChild.rawText;
    if (name in nameToLodestoneId) debugger;
    nameToLodestoneId[name] = id;
  }
}

const lodestoneIds = [];
const Item = Papa.parse(fs.readFileSync('./Item.csv', 'utf8')).data;
const nameIndex = Item[1].indexOf('Name');
for (const line of Item.slice(3)) {
  const name = line[nameIndex];
  if (name) {
    lodestoneIds[Number(line[0])] = nameToLodestoneId[name];
    delete nameToLodestoneId[name];
  }
}
if (Object.keys(nameToLodestoneId).length !== 0) debugger;

fs.writeFileSync('../lodestone-item-id.txt', lodestoneIds.slice(1).join('\n'));
