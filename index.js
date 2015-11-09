//それぞれ変数の定義(websocket必須)
var WebSocketServer = require("ws").Server;		//WebSocket
var http = require("http");						//http
var express = require("express");				//express
var app = express();							//appという名のexpress
var port = process.env.PORT || 5000;			//ポート
//付け加え変数定義
var connections = [];							//Websocket接続の保存用配列


//expressモジュールからhttpサーバを作成し、wsモジュールのseverの引数にし、websocket用サーバオブジェクトを作成
app.use(express.static(__dirname + "/"));
var server = http.createServer(app);
//ポートにwebsocketサーバを立てる
server.listen(port);
var wss = new WebSocketServer({server: server});

//console表示　※ポート番号は毎回変わる
console.log("http server listening on %d", port);
console.log("websocket server created");



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
