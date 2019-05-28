/* 설치한 express와 socket.io모듈 불러오기 */
var express = require('express');
var socket = require('socket.io');

/* Node.js 기본 내장 모듈 불러오기 */
var http = require('http');
var fs = require('fs');

/* express 객체 생성 */
var app = express();

/*sqlite3를 불러와서 부팅과정 중 텍스트 모드로 변환*/
var sqlite = require('sqlite3').verbose();
/*userinfo라는 db 생성, 없으면 만들어주고 있으면 overwrite*/
let db = new sqlite.Database('userinfo.db');
db.run('CREATE TABLE IF NOT EXISTS userinfo(email text NOT NULL,username text NOT NULL,password text NOT NULL)');

/* express http 서버 생성 */
var server = http.createServer(app);
var io = socket(server);


// app.use(cookieParser()); //사용자의 쿠키 내역 가져옴.
app.use('/css', express.static('./public/css'))
app.use('/js', express.static('./public/js'))
app.use(express.json())

/* Get 방식으로 / 경로에 접속하면 실행 됨 */
app.get('/', function(request, response) {
  fs.readFile('./public/login.html', function(err, data) {
    if(err) {
      response.send('에러')
    } else {
      response.writeHead(200, {'Content-Type':'text/html'})
      response.write(data)
      response.end()
    }
  })
})

app.get('/register', function(request, response) {
  fs.readFile('./public/register.html', function(err, data) {
    if(err) {
      response.send('에러')
    } else {
      response.writeHead(200, {'Content-Type':'text/html'})
      response.write(data)
      response.end()
    }
  })
})


/*post 방식으로 보내주면 페이지는 로그인 페이지로 이동*/
app.post('/login', function(request,response){
  var username = request.body.username;
  var password = request.body.password;
  let sql = 'SELECT * FROM userinfo WHERE (username = "${requset.body.username}")';
  db.all(sql, function(err, rows){
    rows.forEach(function(row){
      if(row.password==password){
        response.redirect('/chat');
      }
      else{
        response.send('일치하는 정보가 존재하지 않습니다.');
      }
    })
  })
  db.close();
})

app.post('/register', function(request, response){
  console.log('i am in register')
  db.run('INSERT INTO userinfo(email,username,password) values("${request.body.email}","${request.body.username}","${requset.body.password}")',function(err){
    if(err){
      return console.log(err.message);
    }
    console.log('Rows inserted', request.body.username, request.body.password);
    response.redirect('/login');
  })
  db.close();
})




io.sockets.on('connection', function(socket) {

  /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
  socket.on('newUser', function(name) {
    console.log(name + ' 님이 접속하였습니다.')

    /* 소켓에 이름 저장해두기 */
    socket.name = name

    /* 모든 소켓에게 전송 */
    io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'})
  })

  /* 전송한 메시지 받기 */
  socket.on('message', function(data) {
    /* 받은 데이터에 누가 보냈는지 이름을 추가 */
    data.name = socket.name
    
    console.log(data)

    /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
    socket.broadcast.emit('update', data);
  })

  /* 접속 종료 */
  socket.on('disconnect', function() {
    console.log(socket.name + '님이 나가셨습니다.')

    /* 나가는 사람을 제외한 나머지 유저에게 메시지 전송 */
    socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
  })
})

/* 서버를 8080 포트로 listen */
server.listen(8080, function() {
  console.log('서버 실행 중..')
})