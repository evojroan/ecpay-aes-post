//此區不更動
import axios from "axios"; //npm i axios
import fs from "fs"; //npm i fs
import open from "open"; //npm i open
import crypto from "crypto";
const timenow = Math.floor(Date.now() / 1000);

//一、選擇帳號與金鑰

const MerchantID = 2000132;
const HashKey = "ejCk326UnaZWKisg"; //2000132 電子發票/
const HashIV = "q9jcZX8Ib9LM8wYk"; //2000132 電子發票

//const HashKey = "5294y06JbISpM5x9"; //2000132 物流
//const HashIV = "v77hoKGq4kWxNNIS"; //2000132 物流

//const MerchantID=3002607;
//const HashKey = "pwFHCqoQZGmho4w6"; //3002607 站內付 2.0 金流
//const HashIV = "EkRm7iFT261dpevs"; //3002607 站內付 2.0 金流

//二、選擇要呼叫的節點
const APIURL = "https://einvoice-stage.ecpay.com.tw/B2CInvoice/Issue";


//三、輸入 Data


 const Data = {
  MerchantID: MerchantID,
  RelateNumber: timenow,
  CustomerName: "alicelin",
  CustomerAddr: "台北市大馬路1號",
  CustomerPhone: "0999999999",
  CustomerEmail: "alicelin@test.com",
  Print: 1,
  Donation: 0,
  TaxType: 1,
  SalesAmount: 1000,
  Items: [
    {
      ItemName: "Product1",
      ItemCount: 1,
      ItemWord: "pcs",
      ItemPrice: 500,
      ItemAmount: 500,
    },
    {
      ItemName: "Product2",
      ItemCount: 1,
      ItemWord: "pcs",
      ItemPrice: 500,
      ItemAmount: 500,
    },
  ],
  InvType: "07",
};

//四、以下不用調整，會自動計算

//Data 加密函式
function AESEncoder(Data) {
  let URLEncoded = encodeURIComponent(JSON.stringify(Data));

  const cipher = crypto.createCipheriv("aes-128-cbc", HashKey, HashIV);
  let EncryptedData = cipher.update(URLEncoded, "utf8", "base64");
  EncryptedData += cipher.final("base64");

  return EncryptedData;
}

//Data 解密函式
function AESDecoder(EncryptedData) {
  const decipher = crypto.createDecipheriv("aes-128-cbc", HashKey, HashIV);
  let DecryptedData = decipher.update(EncryptedData, "base64", "utf8");
  DecryptedData += decipher.final("utf8");

  return decodeURIComponent(DecryptedData);
}

//最後要發給綠界 API 的 payload
const PayloadBeforeAES = {
  MerchantID: MerchantID,
  RqHeader: {
    Timestamp: timenow,
  },
  Data: Data,
};

const PayloadAfterAES = {
  MerchantID: MerchantID,
  RqHeader: {
    Timestamp: timenow,
  },
  Data: AESEncoder(Data),
};

//打開視窗
(async () => {
  axios
    .post(APIURL, PayloadAfterAES)
    .then(async (response) => {
      const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>顯示文本</title>
      <style>
      
        .json-content { 
        width:50%;
        word-wrap:break-word;
          white-space: pre-wrap;
          font-family: monospace;
          background-color: #f5f5f5;
          padding: 10px;
        }
      </style>
  </head>
  <body>
  <div>

  <h2>呼叫 API：</h2>
  <div class="json-content">${APIURL}</div>
    <h2>1. 發送 request(Data 加密前)</h2>
    <div class="json-content">${JSON.stringify(PayloadBeforeAES, null, 2)}</div>
    <h2>2. 發送 request(Data 加密後)</h2>
    <div class="json-content">${JSON.stringify(PayloadAfterAES, null, 2)}</div>
    <h2>3. 綠界回傳：</h2>
    <div class="json-content">${JSON.stringify(response.data, null, 2)}</div>
    <h2>4. Data 解密後：</h2>
    <div class="json-content">${JSON.stringify(
      JSON.parse(AESDecoder(response.data.Data)),
      null,
      2
    )}</div>
  </div>
  </body>
  </html>
  `;
      const filePath = "output.html";
      fs.writeFile(filePath, htmlContent, (err) => {
        if (err) throw err;

        console.log("HTML檔案已創建");
        open(filePath).catch((err) => console.error(err));
      });
    })
    .catch((error) => console.log(error));
})();
