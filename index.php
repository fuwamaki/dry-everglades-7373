<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>簡単なチャットアプリ</title>
</script>
</head>
 
<body>
<div>
    <input type="text" id="textArea"></input>
    <button id="sendData">送信</button>
    <p id="returnData"></p>
    
</div>    

<!-- まずはコンテンツを表示させてからjavascriptを読み込む -->
<script src = "/socket.io/socket.io.js"></script>
<script src = "http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js">
<script>
     var socket = io.connect('http://dry-garden-3629.herokuapp.com/');
     document.querySelector('#sendData').addEventListener('click', function () {
         console.log('送信');   
         socket.emit('sendData',$('#textArea')[0].value);
     },false);;

    //サーバからデータを受信した時の処理
    socket.on('returnData', function (message) {
        console.log('return:' + message);
        var elem = document.createElement('div');
        elem.textContent = message;
        $('#returnData')[0].appendChild(elem);;
    });

    //サーバに接続している誰かが接続を切った時
    // dataには，JSONで{value:"user disconnected"}が送られてくる
     socket.on("message", function (data) {
         console.log(data["value"]);
     });


</script>
</body>
</html>