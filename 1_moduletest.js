const express = require('express');
const fs = require('fs');
const bodyparser = require('body-parser');

const app = express();
const port = 3000;

app.engine('html', require('ejs').renderFile);  //views, ejs파일을 html로 변환
app.use(bodyparser.urlencoded());

const module1 = require('./router/module1')(app, fs);

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`)
});