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

		//==websocket処理部分==
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
			
		//==open時、デバイス登録状況を更新==
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



	//-----typeがdebug-----
	} else if(messages.type = "debug"){
	//今のところPCでは特に処理なし
	
	
	//-----typeがtraining-----
	} else if(messages.type = "training"){
	
	//Watchからの受信処理
	
	//-----typeがkinect-----
	} else if(messages.type = "kinect"){
	//kinectからの受信処理
	
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

//デバイス変更ボタン
function onDeviceChangeRadioButton(){
	//未実装
}

//-----台本、稽古部分-----

//+++++台本選択部分+++++

//台本1ボタン
function onScriptButton1(){
	getCSVFile("daihon1.csv");
	document.getElementById("number_script").innerHTML = "1";
	document.getElementById("scripttitle").innerHTML = "無差別";
}

//台本2ボタン
function onScriptButton2(){
	getCSVFile("daihon2.csv");
	document.getElementById("number_script").innerHTML = "2";
	document.getElementById("scripttitle").innerHTML = "喫茶店";
}

//台本3ボタン
function onScriptButton3(){
	getCSVFile("daihon3.csv");
}

//台本4ボタン
function onScriptButton4(){
	getCSVFile("daihon4.csv");
}

//台本5ボタン
function onScriptButton5(){
	getCSVFile("daihon5.csv");
}

//台本6ボタン
function onScriptButton6(){
	getCSVFile("daihon6.csv");
}

//台本7ボタン
function onScriptButton7(){
	getCSVFile("daihon7.csv");
}

//台本8ボタン
function onScriptButton8(){
	getCSVFile("daihon8.csv");
}

//台本決定ボタン
function onScriptDecideButton(){
}

//+++++稽古操作部分+++++

//Watchデバッグ通知ボタン1
function onWatchDebugButton1(){
	send(userid, 'debug', 'watch1');
}

//Watchデバッグ通知ボタン2
function onWatchDebugButton2(){
	send(userid, 'debug', 'watch2');
}

//Watchデバッグ通知ボタン3
function onWatchDebugButton3(){
	send(userid, 'debug', 'watch3');
}

//音チェックボタン
function onSoundCheckButton(){
	//音ファイルを鳴らす
	var audio_correct = new Audio("music/correct_sound.mp3");		//正解音
	var audio_wrong = new Audio("music/wrong_sound.mp3");			//ドラムロール音
	var audio_drumroll = new Audio("music/drumroll_sound.mp3");		//間違い音
	
	audio_drumroll.play();
	setTimeout(function musicplay(){ audio_correct.play(); }, 2700);	//遅延して再生
}

//training用変数定義
var count;			//現在の順番
var scriptArray;	//台本の配列

//稽古スタートボタン
function onStartButton(){
	//初期化
	var ClassElement_1 = document.getElementsByClassName(count-1);
	for(var i = 0; i < ClassElement_1.length; i++){
		ClassElement_1[i].style.backgroundColor = "#ffffff";
	}
	//一番目の色を付加
	count = 1;
	var ClassElement = document.getElementsByClassName(count);
	for(var i = 0; i < ClassElement.length; i++){
		ClassElement[i].style.backgroundColor = "#fffacd";
	}
	
	console.log(scriptArray.length);
	for(var i = 0; i < scriptArray.length; i++){
		if(scriptArray[i][0] == count){
//			console.log("ユーザ" + scriptArray[i][4] + " テキスト" + scriptArray[i][2] + " モーション" + scriptArray[i][3]);
			//watchに通知
			send(scriptArray[i][4],'training',scriptArray[i][2]);	//役者名とセリフを通知
			//kinectに通知
			send(scriptArray[i][4],'kinect', scriptArray[i][3]);	//役者名とモーションを通知
		}
	}
	
	//最後にカウントは1上げる
	count ++;
}

//一時停止ボタン
function onStopButton(){
	//初期化
	var ClassElement_1 = document.getElementsByClassName(count-1);
	for(var i = 0; i < ClassElement_1.length; i++){
		ClassElement_1[i].style.backgroundColor = "#ffffff";
	}
	//色を付加
	var ClassElement = document.getElementsByClassName(count);
	for(var i = 0; i < ClassElement.length; i++){
		ClassElement[i].style.backgroundColor = "#fffacd";
	}
	
	//順番を+1
	count ++;
}

//再スタートボタン
function onRestartButton(){
}

//-1から再スタートボタン
function onRestartBack1Button(){
}

//-2から再スタートボタン
function onRestartBack2Button(){
}

//-----ボックス部分-----

//チャット入力送信ボタン
function onChatSendButton() {
	chat_ipt = document.getElementById("chat_input");
	send(userid, 'chat', chat_ipt.value);
}

//********************台本、稽古 機能イベント********************



//色変えるボタン　デバッグ用
function onChangeColorButton(){
	document.getElementById('2').style.backgroundColor = '#0000ff';
}

//+++++-----台本の読み込み-----+++++

//CSVファイルの読み込み
function getCSVFile(daihon) {
    var xhr = new createXMLHttpRequest();
    xhr.onload = function() {
		//CSVファイルが存在すれば、配列に格納
		createScriptTable(xhr.responseText);
    };
	 //読み込む台本CSVファイルの定義
    xhr.open("get", daihon, true);
    xhr.send(null);
}

//CSVの読み込みに必要なxhrの作成
function createXMLHttpRequest() {
    var XMLhttpObject = null;
    XMLhttpObject = new XMLHttpRequest();
    return XMLhttpObject;
}


function createScriptTable(csvData){
	var CR = String.fromCharCode(13);	//改行コード
    var c_tempArray = csvData.split(CR);	//縦配列、改行コードで分割
    var c_csvArray = new Array();			//横配列
	scriptArray = new Array();
	
	//scriptArrayの初期化
    for(var i = 0; i < c_tempArray.length;i++){ 
		for(var j = 0; j<c_csvArray.length; j++){
			scriptArray[i][j] = "";
		}
	}
	
	
    for(var i = 0; i < c_tempArray.length;i++){ 
		c_csvArray = c_tempArray[i].split(",");		//セミコロンで分割
		scriptArray[i] = new Array();
		for(var j = 0; j<c_csvArray.length; j++){
			scriptArray[i][j] = c_csvArray[j];
		}
	}
//	console.log(scriptArray);
	//台本選択部分に反映
	makeScripttable(c_tempArray.length, scriptArray);
	//台本進行状況に反映
	makeArray(c_tempArray.length, scriptArray);
}


//台本選択-台本概要テーブルの表示
function makeScripttable(length, scriptarray){
	//初期化
	document.getElementById("actor1_name").innerHTML = "none";
	document.getElementById("actor1_first").innerHTML = "none";
	document.getElementById("actor2_name").innerHTML = "none";
	document.getElementById("actor2_first").innerHTML = "none";
	document.getElementById("actor3_name").innerHTML = "none";
	document.getElementById("actor3_first").innerHTML = "none";
	//値の代入
	for(var i = 0; i < length; i++){
		if(scriptarray[i][0] == 0){
			if(scriptarray[i][4] == 1){
				document.getElementById("actor1_name").innerHTML = scriptarray[i][1];
				document.getElementById("actor1_first").innerHTML = scriptarray[i][3];
			} else if(scriptarray[i][4] == 2){
				document.getElementById("actor2_name").innerHTML = scriptarray[i][1];
				document.getElementById("actor2_first").innerHTML = scriptarray[i][3];
			} else if(scriptarray[i][4] == 3){
				document.getElementById("actor3_name").innerHTML = scriptarray[i][1];
				document.getElementById("actor3_first").innerHTML = scriptarray[i][3];
			}
		}
	}
}


//台本進捗状況に台本テーブル表示
function makeArray(length, scriptarray){
	//配列を一旦格納する変数
	var resultTable = "";
	
	//格納する前に初期化
	resultTable = "";
	resultTable = "<table border=1 class=\"script\"><tr class=\"ttitle\"><th class=\"one\">順番</th><th class=\"two\">役者</th><th class=\"three\">セリフ</th><th class=\"four\">動き</th></tr>";
	
	for(var i = 0; i < length; i++){
		for(var j = 0; j < 4; j++){
			if(scriptarray[i][0] != 0){
				if(j == 0){
					resultTable += "<tr class=\""+ scriptarray[i][j] +"\">";	//trにはクラス(0,1,2,3・・・)をつける
					resultTable +="<td>" + scriptarray[i][j] + "</td>";
				} else if(j == 3){
					resultTable +="<td>" + scriptarray[i][j] + "</td></tr>";
				} else {
					resultTable +="<td>" + scriptarray[i][j] + "</td>";
				}
			}
		}
	}
	resultTable += "</table>";

	//作成した配列を台本進行状況に格納する
	displayArray(resultTable);

}

//台本進行状況に台本の配列を表示
function displayArray(resulttable){
	var training_log = document.getElementById("training_field");
	training_log.innerHTML = resulttable;
}



//+++++-----台本の読み込み 終了-----+++++

//+++++-----台本の判定 終了-----+++++

//台本の判定をする
function judgeTraining(){
	//メモ：通知時にwatchフラグとkinectフラグを0に。片方の判定が来ればフラグを立てる。両方立っていれば処理を行う
	//watchからきた判定の処理
	
	//kinectからきた判定の処理
	
	//両方の判定結果が正しければ、次へ進む
	
	//間違っていれば、ブーと音を鳴らす。そして一時停止。（間違いという判断は秒数が良い。秒は予備実験を元に決める必要がある）

}

//+++++-----台本の判定 終了-----+++++
