//それぞれ変数の定義(websocket必須)
var WebSocketServer = require("ws").Server;		//websocket
var http = require("http");						//http
var express = require("express");				//express
var app = express();							//appという名のexpress
var port = process.env.PORT || 5000;			//ポート
//付け加え変数定義
var connections = [];							//Websocket接続の保存用配列

//付け加え
var pc1, pc2, pc3, tablet1, tablet2, tablet3;	//接続状態の記録

//expressモジュールからhttpサーバを作成し、wsモジュールのseverの引数にし、websocket用サーバオブジェクトを作成
app.use(express.static(__dirname + "/"));
var server = http.createServer(app);
//ポートにwebsocketサーバを立てる
server.listen(port);
var wss = new WebSocketServer({server: server});

//console表示　※ポート番号は毎回変わる
console.log("コンソール：http server listening on %d", port);
console.log("コンソール：websocket server created");

var userid = 1;

//クライアントと接続すると動作するイベント
wss.on("connection", function(ws) {
//	失敗した console.log("IDナンバー:" + ws.id);
	
	userid++;

	//接続時のメッセージ
	var id = setInterval(function() {
		//時間データのsend JSON.stringify(xxx)が、クライアントのJSON.parse(event.data)に相当
		ws.send(JSON.stringify({
			type: 'ping',
			text: new Date()
		}), function() {}) 
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
//		console.log('メッセージmessage:', message);
//		悪の根源：broadcast(JSON.stringify(message));
//		console.log('タイプ', JSON.parse(message).type);

		//メッセージはそのままクライアントに送り返す
		broadcast(message);
		
		//typeがpingなら
		if(JSON.parse(message).type == "ping"){
		
		//typeがconnectなら
		} else if(JSON.parse(message).type == "connect"){
			connect(JSON.parse(message).user, JSON.parse(message).text);
		//typeがchatなら
		} else if(JSON.parse(message).type == "chat"){

		//typeがtrainingなら
		}else if(JSON.parse(message).type == "training"){
		
		}
    });
	
})

//ブロードキャスト（メッセージの送信処理）を行う
function broadcast(b_message) {
	connections.forEach(function (con, i) {
		con.send(b_message);
	});
};

//接続系
function connect(s_user, s_text){
	var connect_message;
	

	console.log('コネクトに');
	//オープン、クローズ
	if(s_text == "open"){
		console.log('おーぷん');

		if(pc1 == 1){
			console.log('おーぷん:PC1とうろくされてる');
			connect_message = JSON.stringify({
				user: 'PC.1',
				type: 'connect',
				text: 'open_device'
			});
		}


		
	} else if(s_text == "close"){
	
	//デバイス登録
	} else if(s_text == "PC.1"){
		pc1 == 1;
	} else if(s_text == "PC.2"){
		pc2 == 1;
	} else if(s_text == "PC.3"){
		pc3 == 1;
	} else if(s_text == "TABLET.1"){
		tablet1 == 1;
	} else if(s_text == "TABLET.2"){
		tablet2 == 1;
	} else if(s_text == "TABLET.3"){
		tablet3 == 1;
	}
	
};
