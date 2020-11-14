const express = require('express');
const app = express();  
const port = 3000;

app.use((req, res) => {
    res.writeHead('200', {'content-type':'text/html;charset=utf-8'});
    res.end('<h1>익스프레스 서버에서 응답한 메세지입니다.</h1>');
});

app.listen(port, () => {
    console.log(`${port}포트로 서버 실행중...`);
});