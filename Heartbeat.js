const IoTMessage = require('azure-iot-device').Message;
const beat = { heartbeat: 1 };

async function sendTelemetry(deviceClient, index) {
    console.log('Sending telemetry message %d...', index);

    const msg = new IoTMessage(JSON.stringify(beat));
    msg.contentType = 'application/json';
    msg.contentEncoding = 'utf-8';
    await deviceClient.sendEvent(msg);
}

let intervalToken;

module.exports = class Heartbeat {

    /// Create a new heartbeat telemetry handler
    /// interval is seconds
    constructor(interval, iotClient) {
        this.interval = interval;
        this.client = iotClient;
    }

    startHeartbeat() {
        let index = 0;
        console.log("start heartbeat interval");
        let client = this.client;
        intervalToken = setInterval(() => {
            sendTelemetry(client, index);
            index++;
        }, this.interval);
    }

    stopHeartbeat() {
        clearIntervaal(intervalToken);
    }

}


/// Heartbeat function
// module.exports = function startHeartbeat(interval){
//     console.log("heartbeat funcs");
// }