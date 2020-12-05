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

router.route('/user/login').post((req, res) => {
    console.log('/user/login 호출');
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`parameter - userid:${userid}, userpw:${userpw}`);

    if(database) {
        loginUser(database, userid, userpw, (err, result) => {
            if(err) {
                console.log(err);
            }
            if(result) {
                console.dir(result);
                const username = result[0].name;
                const gender = result[0].gender;
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>로그인 성공</h2>');
                res.write(`<p>아이디 : ${userid}</p>`);
                res.write(`<p>비밀번호 : ${userpw}</p>`);
                res.write(`<p>이름 : ${username}</p>`);
                res.write(`<p>성별 : ${gender}</p>`);
                res.end();
            } else {
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>로그인 실패</h2>');
                res.write('<p>아이디 또는 비밀번호를 확인하세요.</p>');
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

router.route('/user/list').get((req, res) => {
    console.log('/user/list 호출');

    if(database) {
        UserModel.findAll((err, result) => {
            if(err) {
                console.log('리스트 조회 실패');
            }
            if(result) {
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원 리스트</h2>');
                res.write('<div><ul>');
                for(let i=0; i<result.length; i++) {
                    const userid = result[i].userid;
                    const username = result[i].name;
                    const gender = result[i].gender;
                    res.write(`<li>${i} : ${userid} / ${username} / ${gender}</li>`);
                }
                res.write('</ul></div>');
                res.end();
            } else {
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원 리스트</h2>');
                res.write('<p>회원 정보가 없습니다.</p>');
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

const loginUser = function(database, userid, userpw, callback) {
    console.log('loginUser 호출');
    UserModel.find({userid:userid, userpw:userpw}, (err, result) => {
        if(err) {
            callback(err, null);
            return;
        }
        if(result.length > 0) {
            console.log('일치하는 사용자를 찾음');
            callback(null, result);
        } else {
            console.log('일치하는 사용자가 없음');
            callback(null, null);
        }
    });
}

app.use('/', router);

app.listen(port, () => {
    console.log(`${port}번 포트로 서버실행중...`);
    connectDB();
});