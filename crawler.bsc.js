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
  tokens = {
    USDT: {
      bsc: '0x55d398326f99059ff775485246999027b3197955',
      eth: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      sol: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      tomo: '0x381b31409e4d220919b2cff012ed94d70135a59e',
      algrorand: '312769',
      heco: '0xa71edc38d189767582c38a3145b5873052c3e47a',
    },
    USDC: {
      bsc: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      sol: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      tomo: '0xcca4e6302510d555b654b3eab9c0fcb223bcfdf0',
      algrorand: '31566704',
      polygon: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    },
    XRP: {
      bsc: '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe',
      klaytn: '0x9eaefb09fe4aabfbe6b1ca316a3c36afc83a393f',
    },
    ADA: {
      bsc: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
      cardano: 'lovelace',
    },
    MATIC: {
      bsc: '0xcc42724c6683b7e57334c4e856f4c9965ed682bd',
      eth: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
      sol: 'C7NNPWuZCNjZBfW5p6JvGsR8pUdsRpEdP1ZAhnoDwj7h',
      polygon: '0x0000000000000000000000000000000000001010',
      moonbeam: '0x3405a1bd46b85c5c029483fbecf2f3e611026e45',
    },
    DOGE: {
      bsc: '0xba2ae424d960c26247dd6c32edc70b295c744c43',
    },
    DOT: {
      bsc: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
      heco: '0xa2c49cee16a5e5bdefde931107dc1fae9f7773e3',
    },
    DAI: {
      bsc: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      eth: '0x6b175474e89094c44da98b954eedeac495271d0f',
    },
    SHIB: {
      eth: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
    },
    TRX: {
      bsc: '0x4338665cbb7b2485a8855a139b75d5e34ab0db94',
    },
    LTC: {
      bsc: '0x4338665cbb7b2485a8855a139b75d5e34ab0db94',
      heco: '0xecb56cf772b5c9a6907fb7d32387da2fcbfb63b4',
      hoo: '0x13e93721dc992b3e14333dbdb48c0e7ec55431c3',
    },
    AVAX: {
      bsc: '0x1ce0c2827e2ef14d5c4f29a091d735a204794041',
      klaytn: '0xcd8fe44a29db9159db36f96570d7a4d91986f528',
      moonbeam: '0x4792c1ecb969b036eb51330c63bd27899a13d84e',
      avalanche: 'FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z',
    },
    UNI: {
      bsc: '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
    },
    LEO: {
      eth: '0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3',
    },
    LINK: {
      bsc: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
      eth: '0x0eb3a705fc54725037cc9e008bdede697f62f335',
      sol: 'CWE8jPTUYhdCTZYWPTe1o5DFqfdjzWKc9WKz6rSjQUdG',
    },
    ATOM: {
      bsc: '0x0eb3a705fc54725037cc9e008bdede697f62f335',
    },
    TON: {
      bsc: '0x76a797a59ba2c17726896976b7b3747bfd1d220f',
      eth: '0x582d872a1b094fc48f5de31d3b73f2d9be47def1',
    },
    XMR: {
      secret: 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88',
    },
    OKB: {
      eth: '0xae3a768f9ab104c69a7cd6041fe16ffa235d1810',
      okexchain: '0xdf54b6c6195ea4d948d03bfd818d365cf175cfc2',
    },
    XLM: {},
    FIL: {
      bsc: '0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153',
      hoo: '0x0bf85d3b0c9ebcc282fde0591882d12e57e700b3',
      heco: '0xae3a768f9ab104c69a7cd6041fe16ffa235d1810',
    },
    LDO: {
      bsc: '0x986854779804799C1d68867F5E03e601E781e41b',
      eth: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
      sol: 'HZRCwxP2Vq9PCpPXooayhJ2bxTpo5xfpQrwB1svh332p',
    },
    APT: {
      aptos: '0x1::aptos_coin::AptosCoin',
    },
    TUSD: {
      bep2: '0x14016e85a25aeb13065688cafb43044c2ef86784',
      bsc: '0x14016e85a25aeb13065688cafb43044c2ef86784',
      eth: '0x0000000000085d4780B73119b644AE5ecd22b376',
      avalanche: '0x1c20e891bab6b1727d14da358fae2984ed9b59eb',
      tron20: '0x1c20e891bab6b1727d14da358fae2984ed9b59eb',
      arbitrum: '0x4D15a3A2286D883AF0AA1B3f21367843FAc63E07',
    },
    CRO: {
      cosmos:
        'IBC/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1',
      eth: '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
      sol: 'DvjMYMVeXgKxaixGKpzQThLoG98nc7HSU7eanzsdCboA',
    },
    HBAR: {},
    NEAR: {
      bsc: '0x1fa4a73a3f0133f0025378af00236f3abdee5d63',
    },
    VET: {},
    QNT: {
      eth: '0x4a220e6096b25eadb88358cb44068a3248254675',
    },
    APE: {
      eth: '0x4d224452801aced8b2f0aebe155379bb5d594381',
    },
    ICP: {},
    ALGO: {},
    EOS: {
      bsc: '0x56b6fb708fc5732dec1afc8d8556423a2edccbd6',
    },
    GRT: {
      sora: '0x00d1fb79bbd1005a678fbf2de9256b3afe260e8eead49bb07bd3a566f9fe8355',
      eth: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
      sol: 'HGsLG4PnZ28L8A4R5nPqKgZd86zUUdmfnkTRnuFJ5dAX',
      avalanche: '0x8a0cAc13c7da965a312f08ea4229c37869e85cB9',
      arbitrum: '0x23a941036ae778ac51ab04cea08ed6e2fe103614',
      near: 'c944e90c64b2c07662a292be6244bdf05cda44a7.factory.bridge.near',
    },
    BIT: {
      eth: '0x1A4b46696b2bB4794Eb3D4c26f1c55F9170fa4C5',
    },
    EGLD: {
      bsc: '0xbf7c81fff98bbe61b40ed186e4afd6ddd01337fe',
    },
    MANA: {
      gnosis: '0x7838796B6802B18D7Ef58fc8B757705D6c9d12b3',
      eth: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
      sol: '7dgHoN8wBZCc5wbnQ2C47TDnBMAxG4Q5L3KjP67z8kNi',
      funsion: '0x61be5df5459573a7c25673e74281cef4cef81e7d',
    },
    AAVE: {
      bsc: '0xfb6115445bff7b52feb98650c87f44907e58f802',
      eth: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      sol: '3vAs4D1WE6Na4tCgt4BApgFfENbm8WY7q4cSPD1yM4Cg',
      heco: '0x202b4936fe1a82a4965220860ae46d7d3939bb25',
      polygon: '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
      fantom: '0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B',
      avalanche: '0x8ce2dee54bb9921a2ae0a63dbb2df8ed88b91dd9',
      gnosis: '0xDF613aF6B44a31299E48131e9347F034347E2F00',
    },
    FTM: {
      bsc: '0xad29abb318791d579433d831ed122afeaf29dcfe',
      bep2: 'FTM-A64',
      eth: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
      sol: '8gC27rQF4NEDYfyf5aS8ZmQJUum5gufowKGYRRba4ENN',
      celo: '0x218c3c3d49d0e7b37aff0d8bb079de36ae61a4c0',
    },
    FLOW: {
      eth: '0x5c147e74D63B1D31AA3Fd78Eb229B65161983B2b',
    },
    USDP: {
      bsc: '0xb7f8cd00c5a06c0537e2abff0b58033d02e5e094',
      eth: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    },
    ASX: {
      bsc: '0x715d400f88c167884bbcc41c5fea407ed4d2f8a0',
      eth: '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
      sol: 'HysWcbHiYY9888pHbaqhwLYZQeZrcQMXKQWRqS7zcPK5',
      ronin: '0x97a9107c1793bc407d6f527b77e7fff4d812bece',
      harmony: '0x14a7b318fed66ffdcc80c1517c172c13852865de',
    },
    KCS: {
      eth: '0xf34960d9d60be18cc1d5afc1a6f012a723a28811',
    },
    SAND: {
      polygon: '0xbbba073c31bf03b8acf7c28ef0738decf3695683',
      eth: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
      sol: '49c7WuCZkQgc3M4qH8WuEUNXfgwupZf1xqWkDQ7gjRGt',
    },
    CHZ: {
      bep2: 'CHZ-ECD',
      eth: '0x3506424f91fd33084466f402d5d97f05f8e3b4af',
      sol: '5TtSKAamFq88grN1QGrEaZ1AjjyciqnCya1aiMhAgFvG',
    },
    LUNC: {
      bsc: '0x156ab3346823B651294766e23e6Cf87254d68962',
      eth: '0xbd31ea8212119f94a611fa969881cba3ea06fa3d',
      sol: 'F6v4wfAdJB8D8p77bMXZgYt8TDKsYxLYxH5AFhUkYx9W',
      polygon: '0x9cd6746665D9557e1B9a775819625711d0693439',
      avalanche: '0x70928E5B188def72817b7775F0BF6325968e563B',
    },
    IMX: {
      eth: '0xf57e7e7c23978c3caec3c3548e3d615c346e79ff',
    },
    USDD: {
      bsc: '0xd17479997f34dd9156deef8f95a52d81d265be9c',
      eth: '0x0c10bf8fcb7bf5412187a595ab97a3609160b5c6',
      tron20: 'TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn',
      near: '0c10bf8fcb7bf5412187a595ab97a3609160b5c6.factory.bridge.near',
    },
    MKR: {
      bsc: '0x5f0da599bb2cccfcf6fdfd7d81743b6020864350',
      eth: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      avalanche: '0x88128fd4b259552A9A1D457f435a6527AAb72d42',
    },
    KLAY: {
      klaytn: '0x0000000000000000000000000000000000000000',
    },
    RPL: {
      eth: '0xd33526068d116ce69f19a9ee46f0bd304f21a51f',
    },
    HT: {
      near: '6f259637dcd74c767781e37bc6133cd6a68aa161.factory.bridge.near',
      eth: '0x6f259637dcd74c767781e37bc6133cd6a68aa161',
    },
    CRV: {
      sol: '7gjNiPun3AzEazTZoFEjZgcBMeuaXdpjHq2raZTmTrfs',
      eth: '0xD533a949740bb3306d119CC777fa900bA034cd52',
    },
    CAKE: {
      bsc: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      eth: '',
      sol: '',
    },
    OP: {
      bsc: '0x4338665cbb7b2485a8855a139b75d5e34ab0db94',
      eth: '',
      sol: '',
    },
    C98: {
      bsc: '0xaec945e04baf28b135fa7c640f624f8d90f1c3a6',
      eth: '',
      sol: '',
    },
  },
  folderToken = 'tokens';

import fs from 'fs';
import fetch from 'node-fetch';
import shell from 'shelljs';
import * as cheerio from 'cheerio';
async function writeFile(tokenSymbol, fileName, content) {
  return new Promise((resolve, reject) => {
    let dir = `./${folderToken}/${tokenSymbol}`;
    if (!fs.existsSync(dir)) shell.mkdir('-p', dir);
    fs.writeFile(
      `${folderToken}/${tokenSymbol}/${fileName}`,
      content,
      function (err) {
        if (err) reject(err);
        var statusText = 'write file > ' + fileName + ' success';
        log(statusText);
        resolve(true);
      }
    );
  });
}
function readJsonFile(symbolToken, filePath) {
  try {
    const jsonData = fs.readFileSync(
      `./${folderToken}/${symbolToken}/${filePath}`
    );
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(`Error reading JSON file: ${error.message}`);
    return null;
  }
}
async function fetchHolderRawData(tokenSymbol, holderQuantity = 500) {
  try {
    let url =
      `https://bscscan.com/token/tokenholderchart/${tokens[tokenSymbol].bsc}?` +
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
  let v = $('td').eq(i).text().trim();
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
    let row = cheerio.load(rows.eq(i).html().trim(), { xmlMode: true });
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
function genHtmlToJson(htmlBody, sourceData) {
  try {
    let $ = cheerio.load(htmlBody);
    const { totalHolders, totalSupply } = getQuantitySupplyHolder($);
    let records = { totalHolders: [totalHolders], totalSupply: [totalSupply] };
    let rows = $('#ContentPlaceHolder1_resultrows tr');
    log(rows.length - 1);
    // handle total quantity
    if (sourceData) {
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
      if (sourceData) {
        appendHtmlRowToSourceData(row.html().trim(), sourceData);
      } else
        records = {
          ...records,
          ...genHtmlRowToJsonRecord(row.html().trim()),
        };
    }
    // log(records);
    // log(sourceData);
    return sourceData || records;
  } catch (error) {
    log(error);
    return null;
  }
}
function getQuantitySupplyHolder($) {
  let text = $('.u-ver-divider').text().split('Token Total Supply')[1];
  if (text) {
    text = text.substr(1) || text;
    log(text);
    let res = {
      totalHolders: +text.match(/(?<=: )\d+(,\d{3})*/)[0].replace(/,/g, ''),
      totalSupply: +text.match(/\d+(,\d{3})*\.\d+/)[0].replace(/,/g, ''),
    };
    log(res);
    return res;
  }
  return null;
}
async function trackBSCData({
  tokenSymbol,
  holderQuantity = 500,
  sourceJsonDataFile,
}) {
  let htmlBody = await fetchHolderRawData(tokenSymbol, holderQuantity);
  //log(htmlBody)
  //log(htmlBody.indexOf("Sorry, we are unable to generate the token holders chart for this token contract"))
  let sourceData = readJsonFile(tokenSymbol, sourceJsonDataFile);
  // writeFile(
  //   tokenSymbol,
  //   `${tokenSymbol}.bsc.tracking_${Date.now()}.json`,
  //   JSON.stringify(sourceData)
  // );
  let jsonStr = genHtmlToJson(htmlBody, sourceData);
  //log(jsonStr);
  if (jsonStr)
    writeFile(
      tokenSymbol,
      `${tokenSymbol}.bsc.tracking.json`,
      JSON.stringify(jsonStr)
    );
  // call loop as service
  setTimeout(async () => {
    trackBSCData({
      tokenSymbol,
      sourceJsonDataFile,
    });
  }, 60000);
}
(async () => {
  //crawlBSCData('C98');
  // trackBSCData({
  //   tokenSymbol: 'C98',
  //   sourceJsonDataFile: 'C98.bsc.tracking.json',
  // });

  // //crawlBSCData('FIL');
  // trackBSCData({
  //   tokenSymbol: 'FIL',
  //   sourceJsonDataFile: 'FIL.bsc.tracking.json',
  // });
  const args = process.argv.slice(2);
  const token = args[0].toUpperCase();
  const holderQuantity = args[1] || 500;
  try {
    trackBSCData({
      tokenSymbol: token,
      holderQuantity: holderQuantity,
      sourceJsonDataFile: token + '.bsc.tracking.json',
    });
  } catch (error) {
    log(error);
  }
})();
