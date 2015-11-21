//変数定義(websocket必須)
var host = location.origin.replace(/^http/, 'ws');				//host
var ws = new WebSocket(host);									//websocket
//付け加え変数定義
var userid = Math.floor(Math.random() * 500);					//自デバイスのユーザIDをランダムで生成
var pc1_id, pc2_id, pc3_id, tablet1_id, tablet2_id, tablet3_id;	//
var open_switch = 0;											//オープンしてるかどうかのフラグ
var num_dvc;													//自デバイスの値

//**********オープン処理**********
ws.onopen = function(){
	ws.send(JSON.stringify({
		user: userid,
		type: 'connect',
		text: 'open'
	}));
}

//**********クローズイベント**********
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
    ws.close("切断理由");
//	ws.send(JSON.stringify({
//		user: userid,
//		type: 'connect',
//		text: 'close'
//	}));
	
}


//**********サーバからデータ受信時のmessageイベント**********
ws.onmessage = function (event) {

	//変数に値代入
	var chat_ipt = document.getElementById("chat_input");
	var chat_fld = document.getElementById("chat_field");
	var log_fld = document.getElementById("log_field");
	var ping_fld = document.getElementById("ping_field");
	
	var my_con_sts = document.getElementById("my_connect_status");
	var my_dvc_sts = document.getElementById("my_device_status");

	//メッセージの代入
	var messages = JSON.parse(event.data);
//	console.log(messages);
	
	//#####typeがping#####
	if(messages.type == "ping"){
		ping_fld.innerHTML += "ユーザ" + userid + ": " + messages.text + "<br>";
	
	
	//#####typeがconnect#####
	} else if(messages.type == "connect"){

		//===websocket処理部分===
		if(messages.text == "open"){
			//自分が最初にオープンした時の動作
			if(open_switch == 0){
				userid = messages.user;
				open_switch = 1;
				my_con_sts.innerHTML = "OPEN";
				my_dvc_sts.innerHTML = "ユーザ " + userid;
			}
			//共通
			log_fld.innerHTML += "ユーザ " + messages.user + " device opened<br>";
		} else if(messages.text == "close"){
			log_fld.innerHTML += "device closed<br>";
			
		//===open時、デバイス登録状況を更新する===
		} else if(messages.text == "open_device"){
			
			if(userid!="PC1"&&userid!="PC2"&&userid!="PC3"&&userid!="Tablet1"&&userid!="Tablet2"&&userid!="Tablet3"){
			
				if(messages.user == "PC.1"){
					log_fld.innerHTML += "　PC.1：登録済み<br>";
					document.getElementById("con_pc1").innerHTML = "PC.1";
				} else if(messages.user == "PC.2"){
					log_fld.innerHTML += "　PC.2：登録済み<br>";
					document.getElementById("con_pc2").innerHTML = "PC.2";
				} else if(messages.user == "PC.3"){
					log_fld.innerHTML += "　PC.3：登録済み<br>";
					document.getElementById("con_pc3").innerHTML = "PC.3";
				} else if(messages.user == "TABLET.1"){
					log_fld.innerHTML += "　TABLET.1：登録済み<br>";
					document.getElementById("con_tablet1").innerHTML = "TABLET.1";
				} else if(messages.user == "TABLET.2"){
					log_fld.innerHTML += "　TABLET.2：登録済み<br>";
					document.getElementById("con_tablet2").innerHTML = "TABLET.2";
				} else if(messages.user == "TABLET.3"){
					log_fld.innerHTML += "　TABLET.3：登録済み<br>";
					document.getElementById("con_tablet3").innerHTML = "TABLET.3";
				}
			}
		//===デバイス登録部分===
		} else if(messages.text == "PC.1"){
			document.getElementById("con_pc1").innerHTML = "PC.1";
			log_fld.innerHTML += "ユーザ " + messages.user + ": PC1 登録完了" + "<br>";
			if(messages.user == userid) userid = "PC1";
		} else if(messages.text == "PC.2"){
			document.getElementById("con_pc2").innerHTML = "PC.2";
			log_fld.innerHTML += "ユーザ " + messages.user + ": PC2 登録完了" + "<br>";
			if(messages.user == userid) userid = "PC2";
		} else if(messages.text == "PC.3"){
			document.getElementById("con_pc3").innerHTML = "PC.3";
			log_fld.innerHTML += "ユーザ " + messages.user + ": PC3 登録完了" + "<br>";
			if(messages.user == userid) userid = "PC3";
		} else if(messages.text == "TABLET.1"){
			document.getElementById("con_tablet1").innerHTML = "TABLET.1";
			log_fld.innerHTML += "ユーザ " + messages.user + ": TABLET1 登録完了" + "<br>";
			if(messages.user == userid) userid = "Tablet1";
		} else if(messages.text == "TABLET.2"){
			document.getElementById("con_tablet2").innerHTML = "TABLET.2";
			log_fld.innerHTML += "ユーザ " + messages.user + ": TABLET2 登録完了" + "<br>";
			if(messages.user == userid) userid = "Tablet2";
		} else if(messages.text == "TABLET.3"){
			document.getElementById("con_tablet3").innerHTML = "TABLET.3";
			log_fld.innerHTML += "ユーザ " + messages.user + ": TABLET3 登録完了" + "<br>";
			if(messages.user == userid) userid = "Tablet3";
		}
	//#####typeがchat#####
	} else if(messages.type == "chat"){
		chat_fld.innerHTML += "ユーザ " + messages.user + ": " + messages.text + "<br>";
	}

};

	

//**********チャット入力の送信ボタンイベント**********
function send() {
	chat_ipt = document.getElementById("chat_input");
	var chattext = chat_ipt.value;
	chat_fld = document.getElementById("chat_field");
	
	//サーバに送信
	ws.send(JSON.stringify({
		user: userid,
		type: 'chat',
		text: chattext,
	}));
}



	//**********デバイス登録ボタンイベント**********
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
	
	document.getElementById("my_device_status").innerHTML = num_dvc;	//デバイス状態に代入
	
	//他のデバイスにも自身の状態を送信
	ws.send(JSON.stringify({
		user: userid,
		type: 'connect',
		text: num_dvc,
	}));
}

//watchへの通知サンプル部分
function onWatchButton(){
}


//台本の読み込み
function onReadScriptButton(){
	getCSVFile();
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
    var tempArray = csvData.split("\n");
    var csvArray = new Array();
    for(var i = 0; i<tempArray.length;i++){
    csvArray[i] = tempArray[i].split(",");
    console.log(csvArray[i]);
	var training_log = document.getElementById("training_field");
	training_log.innerHTML += csvArray[i] + "<br>";
    }
}
