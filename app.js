var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static("nodejs_chat/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})

/*
//httpを読み込む
var http = require('http');
//フレームワークexpressを読み込む
var express = require('express');
//通信のやり取りを行うsocket.ioの読み込み
var socketIO = require('socket.io');
//portの設定 3000かherokuで準備されているprocess.env.PORTを使用
var port = process.env.PORT || 3000;

//サーバを起動
//var app = express.createServer();
var app = express();
var server = http.createServer(app);

//アクセスした時に表示する内容を設定
app.get('/', function (req, res) {
     //index.htmlファイルを読み込む
     res.sendfile('./index.html');
 //    res.send('Hello, World');
//       server.use(express.static('nodejs_chat'));
});


//ルートディレクトリの設定
//app.configure(function () {
//    app.use(express.static('nodejs_chat'));
//});
//server.configure(function(){
//      server.use(express.static('nodejs_chat'));
//});

//ポート番号の付与
app.listen(port, function () {
    console.log('Listening on ' + port);
});

//var io = socketIO.listen(app);
var io = socketIO.listen(server);

//設定   
//io.configure(function () {
//io.set(function(){
   //HerokuではWebSocketがまだサポートされていない？ので、以下の設定が必要 
//    io.set("transports", ["xhr-polling"]); 
//    io.set("polling duration", 10); 

     //socket.ioのログ出力を抑制する
//    io.set('log level', 1);
//});

io.sockets.on('connection', function (socket) {
        console.log('接続：'+ socket.id);
        socket.on('sendData', function(message){
            console.log('データの受信');
            console.log(message);
             // 全ユーザーにメッセージを送る
            io.sockets.emit('returnData', message);
        });

         socket.on("disconnect", function () {
             //切断した人のsocket.idを表示する
             console.log('切断：' + socket.id);
             // 全ユーザーにメッセージを送る
             io.sockets.emit("message", {"value":"user disconnected"});
         });
        

});
*/