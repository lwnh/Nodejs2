const fs = require('fs');

//비동기는 예외처리 할 필요 없음
fs.readFile('text11.txt', 'utf-8', (err, data) => {
    if(err) {
        console.log('에러발생 - 비동기');
    } else {
        console.log(data);
    }
});

try{
    const text = fs.readFileSync('text11.txt', 'utf-8');
    console.log(text);
} catch(e) {
    //console.log(e);
    console.log('에러발생 - 동기');
}
