var express = require('express');
var socket = require('socket.io');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var mysql = require('mysql');
var app = express();
var server = http.createServer(app);
var io = socket(server);

var config  = require('./config.json');

var connection = mysql.createConnection({
	host: config.host,
  post: config.post,
	user: config.user,
	password: config.password,
	database: config.database
	// host: 'chattingb05.cwgjg4zrhrb6.ap-northeast-1.rds.amazonaws.com',
  // post: 3306,
	// user: 'newuser',
	// password: 'mypassword',
	// database: 'chattingb05'
});

connection.connect(function(err){
	if(err){
		console.error('connect error: ' + err.stack);
		return;
	}
	console.log('Success DB connection');
});

// app.use(cookieParser()); //사용자의 쿠키 내역 가져옴.
app.use('/css', express.static('./public/css'))
app.use('/js', express.static('./public/js'))
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', __dirname + '/public');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

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

  var sql = 'SELECT * FROM user WHERE username = ?';
  connection.query(sql, [name], function(error, results, fields){
    if(results.length == 0){
      response.render('login.html');
    }
    else{
      var db_name = results[0].username;
      var db_pw = results[0].password;

      if(db_pw == pw){
        console.log('Success')
        response.render('chat.html',{username: request.body.username});
      }else {
        console.log('fail')
        response.render('login.html');
      }
    }
  })
})

app.post('/register', function(request, response){
  var name = request.body.username;
  var pw = request.body.password;
  var conf = request.body.confirm;
  var e = request.body.email;
  var sql = 'SELECT * FROM user WHERE username = ?';
  connection.query(sql,[name], function(error, results, fields){
	if(results.length == 0){
      if(pw == conf){
		var sql = `INSERT INTO user VALUES(?, ?, ?)`;
		connection.query(sql, [e, name, pw]);
		response.render('login.html');
	  }
	  else{  //비밀번호 확인 오류
	    response.render('register.html');
	  }
	}
    else{  // 사용중인 아이디일 경우
	  response.render('register.html');
	}
  })
})

io.sockets.on('connection', function(socket) {
  socket.on('login', function(data){
    console.log("hey")
    console.log(data.username + "님이 접속하였습니다.")
    socket.name  = data.username
    name = data.username
    io.sockets.emit('inform', {type: 'connect', name: socket.name + '님이 접속하였습니다.', message: ''})
  })

  socket.on('message', function(data) {
		data.name = socket.name
    console.log(data)
    socket.broadcast.emit('update', data);
  })

  socket.on('disconnect', function() {
    console.log(socket.name + '님이 나가셨습니다.')
    socket.broadcast.emit('inform', {type: 'disconnect', name: socket.name + '님이 나가셨습니다.', message: ''});
  })
})

server.listen(8080, function() {
  console.log('서버 실행 중..')
})
