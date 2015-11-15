//それぞれ変数の定義(websocket必須)
var WebSocketServer = require("ws").Server;		//websocket
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
console.log("コンソール：http server listening on %d", port);
console.log("コンソール：websocket server created");



//クライアントと接続すると動作するイベント
wss.on("connection", function(ws) {
//	失敗した console.log("IDナンバー:" + ws.id);

	//接続時のメッセージ
	var id = setInterval(function() {
		//時間データのsend JSON.stringify(xxx)が、クライアントのJSON.parse(event.data)に相当
		ws.send(JSON.stringify(new Date()), function() {
		}) 
	}, 1000);	//1000ms(1秒)ごとに送信
	
	console.log("コンソール：websocket connection open");

	//websocketクローズ処理
	ws.on("close", function() {
		console.log("コンソール：websocket connection close");
		clearInterval(id);
	});
	
	//配列にWebSocket接続を保存
	connections.push(ws);

	//メッセージ送信時
	ws.on('message', function (message) {
		//console.log('message:', message);
		broadcast(JSON.stringify(message));
    });
	
})

//ブロードキャストを行う
function broadcast(b_message) {
	connections.forEach(function (con, i) {
		con.send(b_message);
	});
};