const express = require('express');
const fs = require('fs');
const ejs = require('ejs'); // npm install ejs

const app = express();
const port = 3000;

const router = express.Router();

//http://localhost:3000/test
router.route('/test').post((req, res) => {
    fs.readFile('./ejstest.ejs', 'utf8', (err, data) => {
        if(!err) {
            res.writeHead(200, {'content-type':'text/html'});
            res.end(ejs.render(data));  // ejs 파일 랜더링(html로 변경해줌)
        } else {
            console.log(err);
        }
    })
});

app.use('/', router);   
app.all('*', (req, res) => {    
    res.status(404).send('<h1>페이지를 찾을 수 없습니다.</h1>');
});

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`);
})
