const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('!@#$%^&*()'));    // 쿠키 암호화

app.get('/login', (req, res) => {
    fs.readFile("login.html", "utf8", (err, data) => {
        res.writeHead(200, {'content-type':'text/html'});
        res.end(data);
    });
});

app.post('/loginOk', (req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    if(userid == "admin" && userpw == "1234") {
        const expriesDay = new Date(Date.now() + (1000*60*60*24))   //1일
        res.cookie('userid', userid, { expires: expriesDay, signed: true });
        res.redirect('/welcome');
    } else {
        res.redirect('/fail');
    }
});

app.get('/welcome', (req, res) => {
    const cookieUserid = req.signedCookies.userid;
    console.log(cookieUserid);
    if(cookieUserid) {
        fs.readFile("welcome.html", "utf8", (err, data) => {
            res.writeHead(200, {'content-type':'text/html'});
            res.end(data);
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/fail', (req, res) => {
    fs.readFile("fail.html", "utf8", (err, data) => {
        res.writeHead(200, {'content-type':'text/html'});
        res.end(data);
    });
});

app.get('/logout', (req, res) => {
   res.clearCookie("userid");
   res.redirect("/login");
});

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`)
});