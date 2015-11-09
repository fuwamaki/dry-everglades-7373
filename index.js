//それぞれ変数の定義
var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);

//consoleに表示
//※ポート番号は毎回変わる
console.log("http server listening on %d", port)

//ポートにWebSocketサーバを立てる
var wss = new WebSocketServer({server: server})
console.log("websocket server created")

//Websocket接続を保存しておく
var connections = [];

//クライアントと接続すると動作するイベント
wss.on("connection", function(ws) {

  var id = setInterval(function() {
  //接続時のメッセージ
  ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

  console.log("websocket connection open")

  //websocketがクローズした際のメッセージ
  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
  
      //配列にWebSocket接続を保存
  connections.push(ws);

      //メッセージ送信時
  ws.on('message', function (message) {
    console.log('message:', message);
    broadcast(JSON.stringify(message));
    });
})

//ブロードキャストを行う
function broadcast(message) {
    connections.forEach(function (con, i) {
        con.send(message);
    });
};
