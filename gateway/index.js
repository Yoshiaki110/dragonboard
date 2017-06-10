'use strict';

var config = require('./config.js');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var iothub = require('azure-iothub');
var registryString = 'HostName=' + config.iothubHostName + ';SharedAccessKeyName=' + config.iothubSharedAccessKeyName + ';SharedAccessKey=' + config.iothubSharedAccessKey;
var registry = iothub.Registry.fromConnectionString(registryString);
var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
//var clientFromConnectionString = require('azure-iot-device-http').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

// デバイス通知
var IoTDevice = (function() {
  // コンストラクタ
  var IoTDevice = function(hostName, deviceId, accessKey) {
      if(!(this instanceof IoTDevice)) {
          return new IoTDevice(hostName, deviceId, accessKey);
      }
      this.hostName = hostName;
      this.deviceId = deviceId;
      this.accessKey = accessKey;
      var connectionString = 'HostName=' + hostName + ';DeviceId=' + deviceId + ';SharedAccessKey=' + accessKey;
      this.client = clientFromConnectionString(connectionString);
      //console.log(this.client);
      this.client.open(function (err) {
        if (err) {
          console.log('Could not connect IoTHub: ' + err);
        } else {
          console.log('Connected to IoTHub');
        }
      });
  }

  var p = IoTDevice.prototype;

  // プロトタイプ内でメソッドを定義
  p.send = function(val) {
    var data = JSON.stringify({ deviceId: this.deviceId, lux: val });
    var message = new Message(data);
    console.log("Sending message: " + message.getData());
    //console.log(this.client);
    this.client.sendEvent(message, function (err) {
      if (err) {
        console.log('Send error: ' + err);
      } else {
        console.log('Send success');
      }
    });
  }

  return IoTDevice;
})();


// HTTPサーバ
// 下記の形式のPOST
// curl -X POST http://localhost:3000 -H "Accept: application/json" -H "Content-type: application/json" -d '{ "name" : "green", "id": "xx:xx:xx" }'
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('/', function(req, res) {
  console.log(req.body);
  console.log(req.body.name);
  res.send('POST request to the homepage');
  createDevice(req.body.name, req.body.id)
})
app.listen(3000);
console.log('HTTP Server is online.');


// デバイスの作成
function printDeviceInfo(err, deviceInfo, res) {
  if (deviceInfo) {
    console.log('Device ID: ' + deviceInfo.deviceId);
    console.log('Device key: ' + deviceInfo.authentication.symmetricKey.primaryKey);
    setTimeout(deleteDevice, 60000, deviceInfo.deviceId)
  }
}

function createDevice(name, id) {
  var device = new iothub.Device(null);
  device.deviceId = name;
  registry.create(device, function(err, deviceInfo, res) {
    if (err) {
      registry.get(device.deviceId, printDeviceInfo);
    }
    if (deviceInfo) {
      console.log('Create Device ID: ' + deviceInfo.deviceId);
      console.log('Create Device key: ' + deviceInfo.authentication.symmetricKey.primaryKey);
      setTimeout(deleteDevice, 60000, deviceInfo.deviceId)
      var iotDevice = new IoTDevice('twintest.azure-devices.net', deviceInfo.deviceId, deviceInfo.authentication.symmetricKey.primaryKey);
      setTimeout(function(){
        iotDevice.send(10);
      }, 10000);
      setTimeout(function(){
        iotDevice.send(20);
      }, 20000);
    }
  });
}

// デバイスの削除
function deleteDevice(name) {
  console.log('Delete Device ID: ' + name);
  registry.delete(name, function(err, non, res) {
    if (err) {
      registry.get(device.deviceId, printDeviceInfo);
    }
  });
}
/*
* $ npm install sandeepmistry/node-sensortag ## (require `libbluetooth-dev`)
* $ TI_UUID=your_ti_sensor_tag_UUID node this_file.js
*/
var myAddress = process.env["TI_ADDRESS"] || "24:71:89:E8:B4:86";
 
function ti_luxometer(conned_obj) {
  var period = 1000; // ms
  conned_obj.enableLuxometer(function() {
    conned_obj.setLuxometerPeriod(period, function() {
      conned_obj.notifyLuxometer(function() {
        console.info("ready: notifyLuxometer");
        console.info("notify period = " + period + "ms");
        conned_obj.on('luxometerChange', function(lux) {
          console.log('\tlux = %d', lux.toFixed(1));
        });
      });
    });
  });
}
 
var SensorTag = require('sensortag');
console.info(">> STOP: Ctrl+C or SensorTag power off");
console.info("start");
function setupSensor(address) {
  console.info("waiting for connect from " + address);
  SensorTag.discoverByAddress(address, function(sensorTag) {
    console.log("<><><> id:", sensorTag.id);
    console.info("found: connect and setup ... (waiting 5~10 seconds)");
    sensorTag.connectAndSetup(function() {
      sensorTag.readDeviceName(function(error, deviceName) {
        console.info("connect: " + deviceName);
        ti_luxometer(sensorTag);
      });
    });
    /* In case of SensorTag PowerOff or out of range when fired `onDisconnect` */
    sensorTag.on("disconnect", function() {
      console.log("<><><> id:", sensorTag.id);
      console.info("disconnect and exit");
      process.exit(0);
    });
  });
}
setupSensor(myAddress);

