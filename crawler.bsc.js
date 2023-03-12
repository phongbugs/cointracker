/**
 * this module will crawl data from Binance Smart Chain and Etherum Chain
 * + Featues 
 *      - Crawl top 500 holders data daily
 *      - Compare data daily together and specify difference 
 * + Question 
 *      - Why Circulating Supply between coinmarketcap and coingecko is defference
 *        11/3/2023 : 216,944,444 Token (CMC) 22% | 408,611,105 Token (CGK) 40%
 *        
        BSC : https://bscscan.com/token/tokenholderchart/0xaec945e04baf28b135fa7c640f624f8d90f1c3a6?range=500
        ETH : https://etherscan.io/token/tokenholderchart/0xae12c5930881c53715b369cec7606b70d8eb229f?range=500
        c98.bsc.20230311.json = {
            "Token Total Supply": 196,805,552,
            "Total Token Holders": 2,292
        }
        csv format:
        rank, address, name, quantity, percentage
        1, 0xf977814e90da44bfa03b6295a0616a897441acec, Binance 8, ="104,656,251.663", 53.1775%

        json format
        "0xf977814e90da44bfa03b6295a0616a897441acec":{

        }
 */
const log = console.log,
chains = {
  'BSC':{
    
  }
},

  addressTokens = {
    C98: '0xaec945e04baf28b135fa7c640f624f8d90f1c3a6',
    FIL: '0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153',
  };

import fs from 'fs';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
function addZeroPrefix(number) {
  return number < 10 ? `0${number}` : number.toString();
}
async function writeFile(tokenSymbol, fileName, content) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(`./${tokenSymbol}`)) fs.mkdirSync(`./${tokenSymbol}`);
    fs.writeFile(`${tokenSymbol}/${fileName}`, content, function(err) {
      if (err) reject(err);
      var statusText = 'write file > ' + fileName + ' success';
      log(statusText);
      resolve(true);
    });
  });
}
async function fetchHolderRawData(tokenSymbol, holderQuantity = 500) {
  try {
    let url =
      `https://bscscan.com/token/tokenholderchart/${addressTokens[tokenSymbol]}?` +
      new URLSearchParams({
        range: holderQuantity,
      });
    log(url);
    const response = await fetch(url);
    const body = await response.text();
    //log(body);
    return body;
  } catch (error) {
    log(error);
    return '';
  }
}
let getTdVal = ($, i) => {
  let v = $('td')
    .eq(i)
    .text()
    .trim();
  switch (i) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      v = v.replaceAll(',', '');
      +v;
      break;
    case 3:
      v = v.replaceAll('%', '');
      +v;
      break;
  }
  return v;
};
/**
 * START RAW DATA
 */
function genHtmlRowToLineCSV(htmlRow) {
  let $ = cheerio.load(htmlRow, { xmlMode: true });
  let csvLineAddress = '';
  let csvLine = `${getTdVal($, 0)}, ${getTdVal($, 1)}, ${getTdVal(
    $,
    2
  )}, ${getTdVal($, 3)}`;
  return csvLine + '\r\n';
}
function genHtmlToCSV(htmlBody) {
  let csvString = `rank, address, quantity, percentage\r\n`;
  let $ = cheerio.load(htmlBody);
  let rows = $('#ContentPlaceHolder1_resultrows tr');
  log(rows.length);
  for (let i = 1; i < rows.length; i++) {
    let row = cheerio.load(
      rows
        .eq(i)
        .html()
        .trim(),
      { xmlMode: true }
    );
    csvString += genHtmlRowToLineCSV(row.html().trim());
  }
  return csvString;
}
async function crawlBSCData(tokenSymbol, holderQuantity = 500) {
  let htmlBody = await fetchHolderRawData(tokenSymbol, holderQuantity);
  let csvString = genHtmlToCSV(htmlBody);
  log(csvString);
  let d = new Date();
  writeFile(
    tokenSymbol,
    `${tokenSymbol}.bsc.${d.getFullYear()}${d.getMonth()}${d.getDate()}_${d.getTime()}.csv`,
    csvString
  );
}
/**
 * END RAW DATA
 */

/**
 * TRACK RAW DATA
 */
function genHtmlRowToJsonRecord(htmlRow) {
  let $ = cheerio.load(htmlRow, { xmlMode: true });
  let record = {};
  record[getTdVal($, 1)] = [getTdVal($, 2)];
  return record;
}
function appendHtmlRowToSourceData(htmlRow, sourceData) {
  let $ = cheerio.load(htmlRow, { xmlMode: true });
  let addressWallet = sourceData[getTdVal($, 1)];
  if (addressWallet) {
    let currentQuantityToken = getTdVal($, 2);
    if (addressWallet[addressWallet.length - 1] !== currentQuantityToken)
      addressWallet.push(currentQuantityToken);
  } else addressWallet = [getTdVal($, 2)];
}
function genHtmlToJson(htmlBody, sourceData) {
  let records = {};
  let $ = cheerio.load(htmlBody);
  let rows = $('#ContentPlaceHolder1_resultrows tr');
  log(rows.length);
  for (let i = 1; i < rows.length; i++) {
    let row = cheerio.load(
      rows
        .eq(i)
        .html()
        .trim(),
      { xmlMode: true }
    );
    if (sourceData) {
      appendHtmlRowToSourceData(row.html().trim(), sourceData);
    } else
      records = {
        ...records,
        ...genHtmlRowToJsonRecord(row.html().trim()),
      };
  }
  return sourceData || records;
}
function readJsonFile(symbolToken, filePath) {
  try {
    const jsonData = fs.readFileSync(`./${symbolToken}/${filePath}`);
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(`Error reading JSON file: ${error.message}`);
    return null;
  }
}
async function trackBSCData({
  tokenSymbol,
  holderQuantity = 500,
  sourceJsonDataFile,
}) {
  let htmlBody = await fetchHolderRawData(tokenSymbol, holderQuantity);
  let sourceData = readJsonFile(tokenSymbol, sourceJsonDataFile);
  let jsonStr = genHtmlToJson(htmlBody, sourceData);
  log(jsonStr);
  writeFile(
    tokenSymbol,
    `${tokenSymbol}.bsc.tracking.json`,
    JSON.stringify(jsonStr)
  );
}
(async () => {
  crawlBSCData('C98');
  trackBSCData({
    tokenSymbol: 'C98',
    sourceJsonDataFile: 'C98.bsc.tracking.json',
  });

  crawlBSCData('FIL');
  trackBSCData({
    tokenSymbol: 'FIL',
    sourceJsonDataFile: 'FIL.bsc.tracking.json',
  });
})();
