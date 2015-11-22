//変数定義(websocket必須)
var host = location.origin.replace(/^http/, 'ws');				//host
var ws = new WebSocket(host);									//websocket
//付け加え変数定義
var userid = Math.floor(Math.random() * 500);					//自デバイスのユーザIDをランダムで生成
var pc1_id, pc2_id, pc3_id, tablet1_id, tablet2_id, tablet3_id;	//
var open_switch = 0;											//オープンしてるかどうかのフラグ
var num_dvc;													//自デバイスの値


//********************オープン処理********************
ws.onopen = function(){
	ws.send(JSON.stringify({
		user: userid,
		type: 'connect',
		text: 'open'
	}));
}

//********************クローズイベント********************
ws.onclose = function(event){
	console.log("クローズ");
	ws.send(JSON.stringify({
		user: userid,
		type: 'connect',
		text: 'close'
	}));
}

window.onunload = function(event){
    // 切断
    ws.onclose("切断理由");
//	ws.send(JSON.stringify({
//		user: userid,
//		type: 'connect',
//		text: 'close'
//	}));
	
}

//********************メッセージ受信イベント********************
ws.onmessage = function (event) {
	//-----メッセージの代入-----
	var messages = JSON.parse(event.data);
//	console.log(messages);


	//-----typeがping-----
	if(messages.type == "ping"){
/*		ping_fld.innerHTML += "ユーザ" + userid + ": " + messages.text + "<br>"; */
		write_ping(userid, messages.text);
	
	//-----typeがconnect-----
	} else if(messages.type == "connect"){

		//===websocket処理部分===
		//オープン
		if(messages.text == "open"){
			//自分が最初にオープンした時の動作
			if(open_switch == 0){
				userid = messages.user;
				open_switch = 1;
				update_connect_status();
				update_pc_status(userid);
			}
			//共通
			write_log(messages.user, " device opened<br>");
		//クローズ
		} else if(messages.text == "close"){
			write_log(messages.user, " device closed<br>");
			
		//===open時、デバイス登録状況を更新する===
		} else if(messages.text == "open_device"){
			
			if(userid!="PC1"&&userid!="PC2"&&userid!="PC3"&&userid!="Tablet1"&&userid!="Tablet2"&&userid!="Tablet3"){
			
				if(messages.user == "PC.1"){
					write_log(messages.user, ":登録済み<br>");
					update_pc1();
				} else if(messages.user == "PC.2"){
					write_log(messages.user, ":登録済み<br>");
					update_pc2();
				} else if(messages.user == "PC.3"){
					write_log(messages.user, ":登録済み<br>");
					update_pc3();
				} else if(messages.user == "TABLET.1"){
					write_log(messages.user, ":登録済み<br>");
					update_tablet1();
				} else if(messages.user == "TABLET.2"){
					write_log(messages.user, ":登録済み<br>");
					update_tablet2();
				} else if(messages.user == "TABLET.3"){
					write_log(messages.user, ":登録済み<br>");
					update_tablet3();
				}
			}
			
		//===デバイス登録部分===
		} else if(messages.text == "PC.1"){
			write_log(messages.user, ":PC.1に登録完了<br>");
			update_pc1();
			if(messages.user == userid) userid = "PC1";
		} else if(messages.text == "PC.2"){
			write_log(messages.user, ":PC.2に登録完了<br>");
			update_pc2();
			if(messages.user == userid) userid = "PC2";
		} else if(messages.text == "PC.3"){
			write_log(messages.user, ":PC.3に登録完了<br>");
			update_pc3();
			if(messages.user == userid) userid = "PC3";
		} else if(messages.text == "TABLET.1"){
			write_log(messages.user, ":TABLET.1に登録完了<br>");
			update_tablet1();
			if(messages.user == userid) userid = "Tablet1";
		} else if(messages.text == "TABLET.2"){
			write_log(messages.user, ":TABLET.2に登録完了<br>");
			update_tablet2();
			if(messages.user == userid) userid = "Tablet2";
		} else if(messages.text == "TABLET.3"){
			write_log(messages.user, ":TABLET.3に登録完了<br>");
			update_tablet3();
			if(messages.user == userid) userid = "Tablet3";
		}
		
	//-----typeがchat-----
	} else if(messages.type == "chat"){
/*		chat_fld.innerHTML += "ユーザ " + messages.user + ": " + messages.text + "<br>"; */
		write_chat(messages.user, messages.text);
	}

};

	
//********************共通機能イベント********************

//サーバに送信メソッド
function send(Userid, Type, Text){
	ws.send(JSON.stringify({
		user: Userid,
		type: Type,
		text: Text,
	}));
}


//********************接続ボックス内のイベント********************

//接続状態の更新
function update_connect_status(){
	var my_con_sts = document.getElementById("my_connect_status");
	my_con_sts.innerHTML = "OPEN";
}

//PCステータスの更新
function update_pc_status(Userid){
	var my_dvc_sts = document.getElementById("my_device_status");
	my_dvc_sts.innerHTML = Userid;
}

//デバイス通信状況の更新-pc1-
function update_pc1(){
	document.getElementById("con_pc1").innerHTML = "PC.1";
}

//デバイス通信状況の更新-pc2-
function update_pc2(){
	document.getElementById("con_pc2").innerHTML = "PC.2";
}

//デバイス通信状況の更新-pc3-
function update_pc3(){
	document.getElementById("con_pc3").innerHTML = "PC.3";
}

//デバイス通信状況の更新-tablet1-
function update_tablet1(){
	document.getElementById("con_tablet1").innerHTML = "TABLET.1";
}

//デバイス通信状況の更新-tablet2-
function update_tablet2(){
	document.getElementById("con_tablet2").innerHTML = "TABLET.2";
}

//デバイス通信状況の更新-tablet3-
function update_tablet3(){
	document.getElementById("con_tablet3").innerHTML = "TABLET.3";
}

//********************チャット、ログ、pingイベント********************

//チャットボックスに書き込み
function write_chat(Userid, Text){
	var chat_fld = document.getElementById("chat_field");
	chat_fld.innerHTML += "ユーザ " + Userid + ": " + Text + "<br>";
}

//ログボックスに書き込み
function write_log(Userid, Text){
	var log_fld = document.getElementById("log_field");
	log_fld.innerHTML += "ユーザ " + Userid + Text;
}

//pingボックスに書き込み
function write_ping(Userid, Text){
	var ping_fld = document.getElementById("ping_field");
	ping_fld.innerHTML += "ユーザ" + Userid + ": " + Text + "<br>";
}

//********************ボタンイベント********************

//-----デバイス登録部分-----

//デバイス登録ボタン
function onDeviceRadioButton(){
	//定義
	var pc1 = document.getElementById("pc1").checked;
	var pc2 = document.getElementById("pc2").checked;
	var pc3 = document.getElementById("pc3").checked;
	var tablet1 = document.getElementById("tablet1").checked;
	var tablet2 = document.getElementById("tablet2").checked;
	var tablet3 = document.getElementById("tablet3").checked;
	
	//値の代入
	if(pc1==true){
		num_dvc = "PC.1";
	} else if(pc2==true){
		num_dvc = "PC.2";
	} else if(pc3==true){
		num_dvc = "PC.3";
	} else if(tablet1==true){
		num_dvc = "TABLET.1";
	} else if(tablet2==true){
		num_dvc = "TABLET.2";
	} else if(tablet3==true){
		num_dvc = "TABLET.3";
	}
	
	//デバイスステータスの更新
	update_pc_status(num_dvc);
	//他のデバイスに更新情報を送信
	send(userid, 'connect', num_dvc);
}


//-----台本、稽古部分-----

//-----ボックス部分-----

//チャット入力送信ボタン
function onChatSendButton() {
	chat_ipt = document.getElementById("chat_input");
	send(userid, 'chat', chat_ipt.value);
}



//watchへの通知サンプル部分
function onWatchButton(){
}


//台本の読み込み
function onReadScriptButton(){
	getCSVFile();
}

//色変えるボタン
function onChangeColorButton(){
	document.getElementById('2').style.backgroundColor = '#0000ff';
}

function getCSVFile() {
    var xhr = new createXMLHttpRequest();
    xhr.onload = function() {
		createArray(xhr.responseText);
    };
 
    xhr.open("get", "daihon1.csv", true);
    xhr.send(null);
}
 
function createXMLHttpRequest() {
    var XMLhttpObject = null;
    XMLhttpObject = new XMLHttpRequest();
    return XMLhttpObject;
}



 
function createArray(csvData) {
	var CR = String.fromCharCode(13); //改行コード
    var tempArray = csvData.split(CR);
    var csvArray = new Array();
	
	var training_log = document.getElementById("training_field");
	var resultTable = "<table border=1 class=\"script\"><tr><th class=\"one\">列:順</th><th class=\"two\">番号</th><th class=\"three\">役者</th><th class=\"four\">セリフ</th></tr>";

	
    for(var i = 0; i<tempArray.length;i++){ 
//		console.log("長さ" + tempArray.length);
//		console.log("tempArray" + i + " " +tempArray[i]);

		csvArray = tempArray[i].split(",");
		for(var j = 0; j<csvArray.length; j++){
			if(j==0){
				resultTable += "<tr id=\""+ i +"\">";	//trにクラスをつける
				resultTable +="<td>" + i + ":" +csvArray[j] + "</td>";
			}else if(j==3){
				resultTable +="<td>" +csvArray[j] + "</td></tr>";
			} else {
				resultTable +="<td>" +csvArray[j] + "</td>";
			}
		}
    }
	
	resultTable += "</table>";
	training_log.innerHTML = resultTable;
	
}

