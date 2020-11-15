const express = require('express');
const fs = require('fs');
const jade = require('jade');  

const app = express();
const port = 3000;

const router = express.Router();

router.route('/userinfo').post((req, res) => {
    fs.readFile('userinfo.jade', 'utf8', (err, data) => {
        if(!err) {
            const jd = jade.compile(data);
            res.writeHead(200, {'content-type':'text/html;charset=utf-8'});
            res.end(jd({userid:"apple", name:"김사과", desc:"착함"}));
        } else {
            console.log(err);
        }
    });
});

app.use('/', router);   
app.all('*', (req, res) => {    
    res.status(404).send('<h1>페이지를 찾을 수 없습니다.</h1>');
});

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`);
})