/*
<input type="text" name="text1" style="width:100px; height:50px; font-size:50px;" value="テキストフィールド">
*/
var express = require('express');
var app = express();

// CORS対応.
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
}
app.use(allowCrossDomain)
app.use(express.static('htdocs'));

var DATA_SIZE = 30;		// グラフデータの数
var data = [
  {
    name: "red",
    cur: 0,
    data: []
  }
];

// １秒毎に呼ばれ、カレントの値をデータにグラフデータに入れる
function setData() {
  for (i = 0; i < data.length; i++) {
    data[i].data.push(Math.floor(data[i].cur));
    if(data[i].data.length > DATA_SIZE) {
      data[i].data.shift();
    }
  }
}
setInterval(setData,1000);

// グラフデータを取得するAPI、全センサの３０回分のデータを渡す
app.get("/api", function(req, res, next){
  res.json(data);						// グラフデータを渡す
  for (i = 0; i < data.length; i++) {
    data[i].cur = 0;					// カレントの値をクリア
  }
});

var port = 3000;
app.listen(port, function(){
  console.log("Expressサーバーがポート%dで起動しました。モード:%s", port, app.settings.env)
});


var config = require('./config.js');
var EventHubClient = require('azure-event-hubs').Client;
var connectionString = 'HostName=' + config.iothubHostName + ';SharedAccessKeyName=' + config.iothubSharedAccessKeyName + ';SharedAccessKey=' + config.iothubSharedAccessKey;

var printError = function (err) {
  console.log(err.message);
};

// IoTHubのメッセージ受信
var printMessage = function (message) {
  console.log('Message received: ' + JSON.stringify(message.body));
  //console.log(message.body.deviceId);
  //console.log(message.body.lux);
  var find = false;
  for (i = 0; i < data.length; i++) {
    if (data[i].name === message.body.deviceId) {
      data[i].cur = message.body.lux - 0;	// カレントの値を設定
      find = true;
      break;
    }
  }
  if (!find) {				// 新しく見つけたデバイスだったら
    var item = {
      name: message.body.deviceId,
      cur: 0,
      data: []
    };
    for (i = 0; i < data[0].data.length; i++) {
      item.data.push(0);	// 他のデバイスと同じ位置にするため
    }
    data.push(item);
  }
};

// IoTHubと接続、全デバイスのデータを受け取る
var client = EventHubClient.fromConnectionString(connectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', printError);
                receiver.on('message', printMessage);
            });
        });
    })
    .catch(printError);
