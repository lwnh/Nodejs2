const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');     // npm i mysql
const logger = require('morgan');

const port = 3000;
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended:false}));
app.use(logger('dev'));

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'nodestudy',
    debug: false
})

router.route('/member/regist').post((req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const age = req.body.age;

    console.log(`parameter - userid:${userid}, userpw:${userpw}, name:${name}, age:${age}`);

    if(pool) {
        addMember(userid, userpw, name, age, (err, result) => {
            if(err) {
                console.log(err);
            }
            if(result) {
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 완료</h2>')
                res.end();
            } else {
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 실패</h2>')
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>')
        res.end();
    }
});

router.route('/member/login').post((req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`parameter - userid:${userid}, userpw:${userpw}`);
    
    if(pool) {
        loginMember(userid, userpw, (err, result) => {
            if(err) {
                console.log(err);
            }
            if(result) {
                console.dir(result);
                const name = result[0].mem_name;
                const age = result[0].mem_age;

                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write(`<p>아이디 : ${userid}</p>`);
                res.write(`<p>이름 : ${name}</p>`);
                res.write(`<p>나이 : ${age}</p>`);
                res.end();
            } else {
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>로그인 실패</h2>')
                res.write('<p>아이디 또는 비밀번호를 확인하세요.</p>')
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>')
        res.end();
    }
});

router.route('/member/edit').post((req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const age = req.body.age;

        console.log(`parameter - userid:${userid}, userpw:${userpw}, name:${name}, age:${age}`);

    if(pool) {
        editMember(userid, userpw, name, age, (err, result) => {
            if(err) {
                console.log(err);
            }
            if(result) {    
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원수정 성공</h2>')
                res.end();
            } else {
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원수정 실패</h2>')
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>')
        res.end();
    }
});

router.route('/member/delete').post((req, res) => {
    const userid = req.body.userid;

    console.log(`parameter - userid:${userid}`);

    if(pool) {
        deleteMember(userid, (err, result) => {
            if(err) {
                console.log(err);
            }
            if(result) {
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원 탈퇴 성공</h2>')
                res.end();
            } else {
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원 탈퇴 실패</h2>')
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>')
        res.end();
    }
});

const addMember = function(userid, userpw, name, age, callback) {
    console.log('addMember 호출');

    pool.getConnection((err, conn) => {
        if(err) {
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 성공');
        const sql = conn.query('insert into tb_member(mem_userid, mem_pass, mem_name, mem_age) values(?, sha1(?), ?, ?)', [userid, userpw, name, age], (err, result) => {
            conn.release();     // 연결 해제
            console.log('sql 정상 실행');
            if(err) {
                callback(err, null);
                return;
            }
            console.log('가입완료');
            callback(null, result);
        });
    });
}

const loginMember = function(userid, userpw, callback) {
    console.log('loginMember 호출');

    pool.getConnection((err, conn) => {
        if(err) {
            callback(err, null);
            return;
        }
        const sql = conn.query('select mem_idx, mem_userid, mem_pass, mem_name, mem_age from tb_member where mem_userid=? and mem_pass=sha1(?)', [userid, userpw], (err, result) => {
            conn.release();    
            console.log('sql 정상 실행');
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
    });
}

const editMember = function(userid, userpw, name, age, callback) {
    console.log('editMember 호출');

    pool.getConnection((err, conn) => {
        if(err) {
            callback(err, null);
            return;
        }
        const sql = conn.query('update tb_member set mem_pass=sha1(?), mem_name=?, mem_age=? where mem_userid=?', [userpw, name, age, userid], (err, result) => {
            conn.release();
            console.log('sql 정상 실행');
            if(err) {
                callback(err, null);
                return;
            }
            console.log('수정 완료');
            callback(null, result);
        });
    });
}

const deleteMember = function(userid, callback) {
    console.log('deleteMember 호출');

    pool.getConnection((err, conn) =>{
        if(err) {
            callback(err, null);
            return;
        }
        const sql = conn.query('delete from tb_member where mem_userid=?', [userid], (err, result) => {
            conn.release();
            console.log('sql 정상 실행');
            if(err) {
                callback(err, null);
                return;
            }
            console.log('삭제 성공');
            callback(null, result);
        })
    });
}

app.use('/', router);

app.listen(port, () => {
    console.log(`${port}번 포트로 서버실행중...`);
});