'use strict';

var config = require('./config.js');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var iothub = require('azure-iothub');
var registryString = 'HostName=' + config.iothubHostName + ';SharedAccessKeyName=' + config.iothubSharedAccessKeyName + ';SharedAccessKey=' + config.iothubSharedAccessKey;
console.log(connectionString);
var registry = iothub.Registry.fromConnectionString(registryString);

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('/', function(req, res) {
  // リクエストボディを出力
  console.log(req.body);
  // パラメータ名、nameを出力
  console.log(req.body.name);

  res.send('POST request to the homepage');
  createDevice(req.body.name, req.body.id)
})

app.listen(3000);
console.log('Server is online.');

// デバイスの作成
function createDevice(name, id) {
  var device = new iothub.Device(null);
  device.deviceId = name;
  registry.create(device, function(err, deviceInfo, res) {
    if (err) {
      registry.get(device.deviceId, printDeviceInfo);
    }
    if (deviceInfo) {
      console.log('Device ID: ' + deviceInfo.deviceId);
      console.log('Device key: ' + deviceInfo.authentication.symmetricKey.primaryKey);
      setTimeout(deleteDevice, 60000, deviceInfo.deviceId)
    }
  });
}

// デバイスの削除
function deleteDevice(name) {
  console.log('Device ID: ' + name);
  registry.delete(name, function(err, non, res) {
    if (err) {
      registry.get(device.deviceId, printDeviceInfo);
    }
  });
}
