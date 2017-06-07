curl -X POST http://localhost:3000 -H "Accept: application/json" -H "Content-type: application/json" -d '{ "name" : "tanaka2", "id": "xx:xx:xx" }'



【連載】Bluetooth LE (5) Android 4.3 で Bluetooth LE 機器を使う
https://blog.fenrir-inc.com/jp/2013/10/bluetooth-le-android.html

npm install express --save

スマホ側
・今あるのから、入力フィールド追加
　・ゲートウエイのアドレス
　・デバイス名
IoTゲートウエイ
・httpサーバ
　・リクエストが来たら登録、接続送信開始

　・ボタン押されたらディスコネクト、デバイス削除


CC2650STKのセンサーデータをNode.jsで取得する
https://users.atmark-techno.com/blog/1914/2362

OpenBlocks IoT BX1でTI製センサータグ(CC2650)のセンサーデータ(10種類)を取得する
http://dev.classmethod.jp/hardware/get-sensor-datas-from-cc2650-to-openblocks-iot-bx1/

sandeepmistry/node-sensortag
https://github.com/sandeepmistry/node-sensortag

https://azure.github.io/azure-iot-sdk-node/azure-iothub/1.1.9/index.html

----------------
Azure IoT Hub
https://docs.microsoft.com/ja-jp/azure/iot-hub/iot-hub-node-node-getstarted
CreateDeviceIdentity.js
	デバイスの作成
ReadDeviceToCloudMessages.js。
	受信
SimulatedDevice.js。
	送信

Azure Web Apps を使用して Azure IoT Hub からのリアルタイム センサー データを視覚化する
https://docs.microsoft.com/ja-jp/azure/iot-hub/iot-hub-live-data-visualization-in-web-apps
----------------
IoTゲートウエイ
一般的なIoTのシステム
デバイス-IoTゲートウエイ-クラウド（BLE、ローカルLANのデータをクラウドへ）
予めデバイスは、IoTゲートウエイとクラウドに登録が必要
多量のデバイス登録は面倒
デバイスのIDどうやって調べる？（デバイスの特定）
特にBLEデバイス、IDなんて書いてない
一般的には登録するデバイスのみ電源を入れる
電波強度で判断する？ゲートウエイと離れていたら電波強度で判断できない
デバイスの状態が別のデバイスと異なるようにすれば
画面の指示で、振ったり、明るさ変えたり
あるいはデバイスのLED/スピーカを鳴らす
そこで、DragonBoard IoTゲートウエイ システム
DragonBoardにIoTゲートウエイの機能を入れた
BLEデバイスのAzureへの登録
BLEデバイスのデータをAzureへ送信
登録はスマホを使ってデバイスID調べずに簡単登録
登録するデバイスをスマホの上に載せて登録ボタンを押すだけ
仕組みは、周りにある接続可能な全てのセンサのデータをとり
スマホの画面を明滅させてそれと同じ照度データを返したデバイスが
スマホ上のデバイスと判断できる

----------------
１日8000メッセージまで送信
１秒毎３台だと４４分可能

