const IoTMessage = require('azure-iot-device').Message;
const beat =  {isAlive: true};

async function sendTelemetry(deviceClient, index) {
    console.log('Sending telemetry message %d...', index);
    
    const msg = new IoTMessage(
        JSON.stringify(beat)
    );
    msg.contentType = 'application/json';
    msg.contentEncoding = 'utf-8';
    await deviceClient.sendEvent(msg);
  }

let intervalToken;

module.exports = class Heartbeat{

    /// Create a new heartbeat telemetry handler
    /// interval is seconds
    constructor(interval, iotClient){
        this.interval = interval;
        this.client = iotClient;
    }

    async startHeartbeat(){
        let index = 0;
        // intervalToken = setInterval(() => {
        //     sendTelemetry(this.client, index).catch((err) => { console.log('error', err.toString()); });
        //     index++;
        // }, this.interval);

        let client = this.client;
        intervalToken = setInterval(() => {
            // I use axios like: axios.get('/user?ID=12345').then
            new Promise(function(resolve, reject){
                sendTelemetry(client, index).then(r => resolve('sent_heartbeat'))
             
            }).then(res => {
                console.log('then');
                console.log(res);
                if (true) {
                    index++;
                   // do something 
                } else {
                   clearInterval(intervalToken)
                }    
            })  
        }, this.interval)  



    }

    stopHeartbeat(){
        clearIntervaal(intervalToken);
    }

}


/// Heartbeat function
module.exports = function startHeartbeat(interval){
    console.log("heartbeat funcs");
}