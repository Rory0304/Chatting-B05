
var express = require('express');
var socket = require('socket.io');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var sqlite = require('sqlite3').verbose();

var app = express();
var server = http.createServer(app);
var io = socket(server);

let db = new sqlite.Database('userinfo.db');
db.run('CREATE TABLE IF NOT EXISTS userinfo(email text NOT NULL UNIQUE,username text NOT NULL UNIQUE,password text NOT NULL)');

// app.use(cookieParser()); //사용자의 쿠키 내역 가져옴.
app.use('/css', express.static('./public/css'))
app.use('/js', express.static('./public/js'))
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', __dirname + '/public');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
//app.engine('html', ejs.renderFile);

/* Get 방식으로 / 경로에 접속하면 실행 됨 */
app.get('/', function(req, res){
  res.render('login.html')
})

app.get('/register', function(req, res){
  res.render('register.html')
})

app.get('/chat', function(req, res){
  res.render('chat.html')
})

app.get('/login', function(req, res){
  res.render('login.html')
})

app.post('/login', function(request,response){
  var name = request.body.username;
  var pw = request.body.password;
  let sql = 'SELECT * FROM userinfo WHERE username like ?';
  db.get(sql, [name], (err, row) => {
  if (err) {
    return console.error(err.message);
  }
  if(row) {			//아이디 등록이 되어있을 때
    if(row.password !== pw){ 		//비밀번호가 다를때
      console.log('password err')
      console.log(row.password, pw)
      response.redirect('/login')
    }
    else { 			//비밀번호가 같을 때
      console.log(row.username, row.password, pw)
      response.render('chat.html',{username: request.body.username}) }
    } //이름 정보를 html에 보냄
  else {		//아이디 등록이 안되있을 때
    console.log('id err..')
    response.redirect('/login') }
  })
})

app.post('/register', function(request, response){
  var name = request.body.username;
  var pw = request.body.password;
  var e = request.body.email;
  var user = [e,name,pw];
  var sql = 'INSERT INTO userinfo VALUES (?,?,?)';
  console.log('i am in register')
  db.run(sql, user,function(err){
    if(err){
      return console.log(err.message);
    }
    console.log('Rows inserted', name, pw);
	response.redirect('/login');
  })
})


io.sockets.on('connection', function(socket) {
  /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
  socket.on('login', function(data){
    console.log("hey")
    console.log(data.username + "님이 접속하였습니다.")
    socket.name  = data.username
    name = data.username
    io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'})
  })

  // socket.on('newUser', function(name) {
  //   socket.name = nam
  // })

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
