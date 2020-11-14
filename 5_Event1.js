const events = require('events');
// 이벤트 관련 메소드를 사용할 수 있도록 객체 생성
const eventEmitter = new events.EventEmitter();

const connectHandler = function connected() {   // 2
    console.log('연결성공');    
    eventEmitter.emit('data_received');
}

eventEmitter.on("connection", connectHandler);  

eventEmitter.on('data_received', function(){    // 3
    console.log('데이터 수신');
})

eventEmitter.emit('connection');    // 1 : connection 이벤트 발생
console.log('프로그램을 종료합니다.');  // 4