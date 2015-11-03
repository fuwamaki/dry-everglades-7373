<!DOCTYPE HTML>
<html>
<head>
  <meta charset="UTF-8">
  <title>node.js chat</title>
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
  <script src="/socket.io/socket.io.js"></script>
  <script type="text/javascript">
 
  var s = io.connect(); //リモート
//  var s = io.connect('http://localhost:3000'); //ローカル
 
  //サーバから受け取るイベント
  s.on("connect", function () {});  // 接続時
  s.on("disconnect", function (client) {});  // 切断時
  s.on("S_to_C_message", function (data) {
    addMessage(data.value);
  });
 
  //クライアントからイベント送信（イベント名は自由に設定できます）
  function sendMessage() {
    var msg = $("#message").val(); //取得
    $("#message").val(""); //空白にする
    s.emit("C_to_S_message", {value:msg}); //サーバへ送信
  }
 
  function sendBroadcast() {
    var msg = $("#message").val(); //取得
    $("#message").val(""); //空白にする
    s.emit("C_to_S_broadcast", {value:msg}); // サーバへ送信
  }
 
  //jqueryでメッセージを追加
  function addMessage (value,color,size) {
    var msg = value.replace( /[!@$%<>'"&|]/g, '' ); //タグ記号とかいくつか削除
    $("#msg_list").prepend("<div class='msg'>" + msg + "</div>");
  }    
 
  </script>
  <style>
    *{
      font-size:30px;
      margin:0;
      padding:0;
    }
  </style>
</head>
<body>
  <div id="msg_list" style="height:300px; overflow:auto;"></div>
  <form action="" method="post" onsubmit="return false;">
    <input type="text" class="text" style="width:95%; padding:10px" id="message"/>
    <input type="submit" class="button" style="padding:10px" onclick="sendMessage();" value="みんなに送信" />
    <input type="submit" class="button" style="padding:10px" onclick="sendBroadcast();" value="自分以外に送信" />
  </form>
</div>
</body>
</html>

