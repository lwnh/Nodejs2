const express = require('express');
const bodyParser = require('body-parser');  

const app = express();  
const port = 3000;

app.use(bodyParser.urlencoded({extended:false}));

const router = express.Router();

//http://localhost:3000/member/login으로 접속해야 동작
router.route('/member/login').post((req, res) => {
    console.log('/member/login 호출');
});

//http://localhost:3000/member/regist
router.route('/member/regist').post((req, res) => {
    console.log('/member/regist 호출');
});

app.use('/', router);   // 라우터 적용
app.all('*', (req, res) => {    // 나머지 페이지 전부
    res.status(404).send('<h1>페이지를 찾을 수 없습니다.</h1>');
});

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`);
})
