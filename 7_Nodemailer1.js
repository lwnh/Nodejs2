const nodemailer = require('nodemailer');

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
    from: "홍길동 <eo8umm@gmail.com>",
    to: "김길동 eo8um@naver.com",
    subject: "node.js의 nodemailer 테스트중입니다.",
    text: "안녕하세요. 메일이 잘 전달되나요???"
};

transporter.sendMail(mailOptions, (err, info) => {
    transporter.close();
    if(err) {
        console.log(err);
    } else {
        console.log(info);
    }
});