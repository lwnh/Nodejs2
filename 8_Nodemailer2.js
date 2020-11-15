const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:false}));

const router = express.Router();

//localhost:3000/mail
router.route('/mail').get((req, res) => {
    fs.readFile('mail.html', 'utf-8', (err, data) => {
        if(err) {
            console.log(err);
        } else {
            res.writeHead(200, {'content-type':'text/html'});
            res.end(data);
        }
    });
});

router.route('/mailok').post((req, res) => {
    const fromName = req.body.fromName;
    const fromemail = req.body.fromEmail;
    const toName = req.body.toName;
    const toEmail = req.body.toEmail;
    const title = req.body.title;
    const content = req.body.content;

    const fromMsg = `${fromName}<${fromemail}>`;
    const toMsg = `${toName}<${toEmail}>`;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'google id',
            pass: 'google pw'
        },
        host: 'smtp.mail.com',
        port: '465'
    });

    const mailOptions = {
        from: fromMsg,
        to: toMsg,
        subject: title,
        text: content
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
        transporter.close();
        if(err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });

    res.writeHead(200, {'content-type':'text/html;charset=utf-8'});
    res.end('메일 전송 완료!');
});

app.use('/', router);   
app.all('*', (req, res) => {    
    res.status(404).send('<h1>페이지를 찾을 수 없습니다.</h1>');
});

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`);
})