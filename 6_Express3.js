const express = require('express');
const app = express();  
const port = 3000;

app.use((req, res, next) => {
    console.log('첫번째 미들웨어 실행');
    req.user = 'apple';
    next(); // 다음 미들웨어로 넘어감
});

app.use('/', (req, res, next) => {
    console.log('두번째 미들웨어 실행');
    res.writeHead('200', {'content-type':'text/html;charset=utf-8'});
    res.end(`<h1>${req.user}</h1>`);
});

app.listen(port, () => {
    console.log(`${port}포트로 서버 실행중...`);
});