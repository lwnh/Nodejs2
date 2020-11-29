const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');   // npm i mongoose

const port = 3000;
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended:false}));
app.use(logger('dev'));

// 데이터베이스 연결
let database;
let UserSchema;
let UserModel;

function connectDB() {
    const url = "mongodb://localhost:27017/nodedb";
    console.log('데이터베이스 연결 시도중...');
    mongoose.Promise = global.Promise;  //몽구스의 프로미스 객체는 global의 프로미스 객체로 사용할 수 있음
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    database = mongoose.connection;
    database.on('error', console.error.bind(console, "mongoose connection error!"));
    database.on('open', () => {
        console.log('데이터베이스 연결 성공');
        UserSchema = mongoose.Schema({
            userid: String,
            userpw: String,
            name: String,
            gender: String
        });
        console.log('UserSchema 생성 완료');

        UserSchema.static('findAll', function(callback) {
            return this.find({}, callback);
        });

        UserModel = mongoose.model("user", UserSchema);
        console.log('UserModel이 정의되었습니다.');
    });
}

// localhost:3000/user/regist
router.route('/user/regist').post((req, res) => {
    console.log('/user/regist 호출');
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const gender = req.body.gender;

    console.log(`parameter - userid:${userid}, userpw:${userpw}, name:${name}, gender:${gender}`);

    if(database) {
        addUser(database, userid, userpw, name, gender, (err, result) => {
            if(err) {
                console.log(err);
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 실패</h2>');
                res.write('<p>서버 오류 발생. 회원가입에 실패했습니다.</p>');
                res.end();
            } 
            if(result) {
                console.dir(result);
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 성공</h2>');
                res.write('<p>회원가입이 성공적으로 되었습니다.</p>');
                res.end();
            } else {
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 실패</h2>');
                res.write('<p>회원가입에 실패했습니다.</p>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
});

const addUser = function(database, userid, userpw, name, gender, callback) {
    console.log('addUser 호출');
    const users = new UserModel({userid:userid, userpw:userpw, name:name, gender:gender});

    users.save((err, result) => {
        if(err) {
            callback(err, null);
            return;
        }
        console.log('회원 document가 추가되었습니다.');
        callback(null, result);
    });
}

app.use('/', router);

app.listen(port, () => {
    console.log(`${port}번 포트로 서버실행중...`);
    connectDB();
});