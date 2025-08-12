// This script will send many requests to SE's server, and the final result is already committed into the repo.
// If you really want to run it again, comment next line.
process.exit();

process.chdir(__dirname);

const util = require('util');
const stream = require('stream');
const fs = require('fs');
const fetch = require('node-fetch');

const pipeline = util.promisify(stream.pipeline);

const baseUrl = 'https://na.finalfantasyxiv.com/lodestone/playguide/db/item/?page=';
const pageCount = 859;

(async () => {
  fs.mkdirSync('./pages', { recursive: true });
  for (let page = 1; page <= pageCount; page++) {
    try {
      const res = await fetch(baseUrl + page);
      if (!res.ok) throw res.statusText;
      await pipeline(res.body, fs.createWriteStream(`./pages/${page}.html`));
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`page ${page} finished.`);
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error(page, e);
    }
  }
})();

(async () => {
  const res = await fetch('https://raw.githubusercontent.com/xivapi/ffxiv-datamining/master/csv/Item.csv');
  await pipeline(res.body, fs.createWriteStream(`./Item.csv`));
})();
