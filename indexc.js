//変数定義(websocket必須)
var host = location.origin.replace(/^http/, 'ws');				//host
var ws = new WebSocket(host);									//websocket
//付け加え変数定義
var userid = Math.floor(Math.random() * 500);					//ユーザIDをランダムで生成
var pc1_id, pc2_id, pc3_id, tablet1_id, tablet2_id, tablet3_id;	//
var open_switch = 0;

//**********オープン処理**********
ws.onopen = function(){
//	ws.send('open');
	ws.send(JSON.stringify({
		user: userid,
		type: 'connect',
		text: 'open'
	}));
}

//**********クローズイベント**********
//ws.onclose = function(){
//	ws.send("close");
//}


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
//	console.log(messages.user + messages.type + messages.text);
	
	//typeがping
	if(messages.type == "ping"){
		ping_fld.innerHTML += "ユーザ" + userid + ": " + JSON.parse(event.data).text + "<br>";
//		console.log(JSON.parse(event.data));
	
	
	//typeがconnect
	} else if(messages.type == "connect"){
//	console.log("タイプがコネクトなら" + messages.user + messages.type + messages.text);
		//websocket処理部分
		if(messages.text == "open"){
			if(open_switch == 0){
				userid = messages.user;
				open_switch = 1;
				my_con_sts.innerHTML = "OPEN";
				my_dvc_sts.innerHTML = "ユーザ " + userid;
			}
			log_fld.innerHTML += "ユーザ " + messages.user + " device opened<br>";
		} else if(messages.text == "close"){
			log_fld.innerHTML += "device closed<br>";
			
		//open時、デバイス登録状況を更新する
		} else if(messages.text == "open_device"){
			
			if(userid!="PC1"||userid!="PC2"){
			
			
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
		//デバイス登録部分
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
	//typeがchat
	} else if(messages.type == "chat"){
		chat_fld.innerHTML += "ユーザ " + messages.user + ": " + messages.text + "<br>";
	}

};

	

//**********ログ入力の送信ボタンイベント**********
function send() {
	//サーバに送信
	chat_ipt = document.getElementById("chat_input");
	var chattext = chat_ipt.value;
	chat_fld = document.getElementById("chat_field");
	
//	通信ありで送信したい場合
//	ws.send(chattext);
	ws.send(JSON.stringify({
		user: userid,
		type: 'chat',
		text: chattext,
	}));
//	通信なしで送信したい場合
//	chat_fld.innerHTML += chattext;
//	console.log("inputからメッセージを送信" + chattext);
}


var num_dvc;	//自デバイスの値

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
		document.getElementById("con_pc1").innerHTML = num_dvc;			//デバイス通信状況に
	} else if(pc2==true){
		num_dvc = "PC.2";
		document.getElementById("con_pc2").innerHTML = num_dvc;			//デバイス通信状況に
	} else if(pc3==true){
		num_dvc = "PC.3";
		document.getElementById("con_pc3").innerHTML = num_dvc;			//デバイス通信状況に
	} else if(tablet1==true){
		num_dvc = "TABLET.1";
		document.getElementById("con_tablet1").innerHTML = num_dvc;		//デバイス通信状況に
	} else if(tablet2==true){
		num_dvc = "TABLET.2";
		document.getElementById("con_tablet2").innerHTML = num_dvc;		//デバイス通信状況に
	} else if(tablet3==true){
		num_dvc = "TABLET.3";
		document.getElementById("con_tablet3").innerHTML = num_dvc;		//デバイス通信状況に
	}
	
	document.getElementById("my_device_status").innerHTML = num_dvc;	//デバイス状態に
	
	//他のデバイスにも自身の状態を送信
//	ws.send(num_dvc);
	ws.send(JSON.stringify({
		user: userid,
		type: 'connect',
		text: num_dvc,
	}));
}