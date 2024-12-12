# 這是什麼？
呼叫綠界電子發票、全方位物流、站內付 2.0 時，需要將 Data 中的參數進行 AES 加密後再呼叫 API。綠界 API 回傳的資料也要解密。本程式自動完成 AES 加解密，使用者只要修改參數即可。

# 如何使用
1. 先安裝： `npm i axios open`
2. 於 app.js 修改必須的內容，例如帳號與金鑰、呼叫的 API 網址與 Data 內的參數。
3. 執行 app.js
4. 程式會自動產生 output.html，內部展示發送的所有資料、回傳的資料，以及其 AES 加解密的內容。

# 本工具介紹文章
[https://medium.com/@roan6903/ecpay-aes-post-db7d4df8280e](https://medium.com/@roan6903/ecpay-aes-post-db7d4df8280e)

# 關於作者
- Roan
- [https://medium.com/@roan6903](https://medium.com/@roan6903)
