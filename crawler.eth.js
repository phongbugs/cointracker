const log = console.log,
  folderToken = 'tokens',
  suffixTrackingJsonFiles = '.eth.tracking.json',
  urlChainETH = 'https://etherscan.io/token/generic-tokenholders2?';

import tokens from './chains.js';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { readFile, writeFile } from './utils.js';

async function fetchHtmlBody(tokenSymbol, pageNumber) {
  try {
    let url =
      urlChainETH +
      new URLSearchParams({
        a: tokens[tokenSymbol].eth,
        p: pageNumber,
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
  let v = $('td').eq(i).text().trim();
  //if (i === 1) log(v);
  switch (i) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      v = v.replaceAll(',', '');
      v = +v;
      break;
    case 3:
      v = v.replaceAll('%', '');
      v = +v;
      break;
  }
  return v;
};
function genHtmlRowToJsonObject(htmlRow) {
  let $ = cheerio.load(htmlRow, { xmlMode: true });
  let record = {};
  record[getTdVal($, 1)] = [getTdVal($, 2)];
  return record;
}
function appendData(htmlRow, sourceData) {
  let $ = cheerio.load(htmlRow, { xmlMode: true });
  let addressWallet = getTdVal($, 1);
  let transactions = sourceData[addressWallet];
  if (transactions) {
    let currentQuantityToken = getTdVal($, 2);
    let lastQuantityToken = transactions[transactions.length - 1];
    if (lastQuantityToken !== currentQuantityToken) {
      let adjustedQuantityToken = lastQuantityToken - currentQuantityToken;
      let isSell = adjustedQuantityToken > 0;
      log(
        `${addressWallet}: ${
          isSell ? 'SELL' : 'BUY'
        } -> ${adjustedQuantityToken}`
      );
      transactions.push(currentQuantityToken);
      log(transactions);
    }
  } else addressWallet = [getTdVal($, 2)];
}
function genBodyHtmlToJsonObjects({
  htmlBody,
  sourceData,
  totalHolders,
  totalSupply,
}) {
  try {
    let $ = cheerio.load(htmlBody);
    let records = {};
    //log(records);
    let rows = $('.table-responsive tr');
    log(rows.length - 1);
    // handle total quantity
    if (Object.keys(sourceData).length > 2) {
      let arrTotalHolders = sourceData['totalHolders'];
      let arrTotalSupply = sourceData['totalSupply'];
      let lastQuantityTotalHolders =
        arrTotalHolders[arrTotalHolders.length - 1];
      let lastQuantityTotalSupply = arrTotalSupply[arrTotalSupply.length - 1];
      if (lastQuantityTotalHolders !== totalHolders) {
        sourceData['totalHolders'].push(totalHolders);
        let adjustedQuantityTotalHolder =
          lastQuantityTotalHolders - totalHolders;
        let isAdded = adjustedQuantityTotalHolder < 0;
        log(
          `Total Holder: ${
            isAdded ? 'Added' : 'Deleted'
          } -> ${adjustedQuantityTotalHolder}`
        );
      }

      if (lastQuantityTotalSupply !== totalSupply) {
        sourceData['totalSupply'].push(totalSupply);
        let adjustedQuantityToken = lastQuantityTotalSupply - totalSupply;
        let isMinted = adjustedQuantityToken < 0;
        log(
          `Total Supply: ${
            isMinted ? 'Minted' : 'Burned'
          } -> ${adjustedQuantityToken}`
        );
      }
    }
    // handle data table address wallet
    for (let i = 1; i < rows.length; i++) {
      let row = cheerio.load(rows.eq(i).html().trim(), { xmlMode: true });
      let htmlRow = row.html().trim();
      //log(htmlRow)
      if (Object.keys(sourceData).length > 2) {
        appendData(htmlRow, sourceData);
      } else
        records = {
          ...records,
          ...genHtmlRowToJsonObject(htmlRow),
        };
    }
    //log(records);
    //log(sourceData);
    return sourceData || records;
  } catch (error) {
    log(error);
    return null;
  }
}
async function getQuantitySupplyHolder(tokenSymbol) {
  let url = `https://etherscan.io/token/${tokens[tokenSymbol].eth}`;
  log(url);
  let htmlBody = await (await fetch(url)).text();
  //log(htmlBody);
  let $ = cheerio.load(htmlBody);
  let holderText = $('#ContentPlaceHolder1_tr_tokenHolders').text();
  let supplyText = $('#ContentPlaceHolder1_hdnTotalSupply').val();
  //log(`%s %s`, holderText, supplyText)
  let res = {
    totalHolders: +holderText.match(/[\d,]+(?=\s\()/)[0].replace(/,/g, ''),
    totalSupply: +supplyText.replaceAll(',', ''),
  };
  //log(res);
  return res;
}
async function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function fetchETHData({
  tokenSymbol,
  pageNumber,
  totalHolders,
  totalSupply,
  sourceData,
}) {
  let htmlBody = await fetchHtmlBody(tokenSymbol, pageNumber);
  sourceData = {
    ...sourceData,
    ...genBodyHtmlToJsonObjects({
      htmlBody,
      sourceData,
      totalHolders,
      totalSupply,
    }),
  };
  //log(objects)
  return sourceData;
}
async function fetchETHDataRecursive({
  tokenSymbol,
  startPage,
  totalPage,
  totalHolders,
  totalSupply,
  sourceData,
}) {
  await delay(250);
  return await fetchETHData({
    tokenSymbol,
    pageNumber: startPage,
    totalHolders,
    totalSupply,
    sourceData,
  }).then(async (objects) => {
    sourceData = { ...sourceData, ...objects };
    if (++startPage <= totalPage)
      return await fetchETHDataRecursive({
        tokenSymbol,
        startPage,
        totalPage,
        totalHolders,
        totalSupply,
        sourceData,
      });
    else return sourceData;
  });
}
async function trackETHData(tokenSymbol) {
  let fileName = `./${folderToken}/${tokenSymbol}/${tokenSymbol}${suffixTrackingJsonFiles}`;
  let sourceData = readFile(fileName);
  const { totalHolders, totalSupply } = await getQuantitySupplyHolder(
    tokenSymbol
  );
  let objects = await fetchETHDataRecursive({
    tokenSymbol,
    startPage: 1,
    totalPage: 2,
    totalHolders,
    totalSupply,
    sourceData: { totalHolders: [totalHolders], totalSupply: [totalSupply] },
  });
  // let header = { totalHolders: [totalHolders], totalSupply: [totalSupply] };
  // objects = { ...header, ...objects };
  if (objects) writeFile(fileName, JSON.stringify(objects));
  // call loop as service
  setTimeout(async () => {
    trackETHData(tokenSymbol);
  }, 60000);
}
(async () => {
  const args = process.argv.slice(2);
  const token = args[0].toUpperCase();
  const holderQuantity = args[1] || 500;
  try {
    trackETHData(token);
  } catch (error) {
    log(error);
  }
  //console.log(await getQuantitySupplyHolder('C98'));
})();
