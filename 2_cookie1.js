const express = require('express');
const cookieParser = require('cookie-parser');  //npm install cookie-parser

const app = express();
const port = 3000;

app.use(cookieParser());

app.get('/setCookie', (req, res) => {
    console.log('setCookie 호출');
    res.cookie('member', 
    {
        id:'apple',
        name: '김사과',
        gender: 'female'
    },
    {
        maxAge: 1000 * 60 * 60  // 60분
    });
    res.redirect('/showCookie');
});

app.get('/showCookie', (req, res) => {
    console.log('showCookie호출');
    res.send(req.cookies);
    res.end();
})

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`)
});