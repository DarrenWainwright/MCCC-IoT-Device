
//'use strict'
const IoTProtocol = require('azure-iot-device-mqtt').Mqtt;
const IoTClient = require('azure-iot-device').Client;
const IoTMessage = require('azure-iot-device').Message;
const IoTConnectionString = require('azure-iot-common').ConnectionString;
const modelIdObject = { modelId: 'dtmi:mccc-hub:mccc-device;1' };
const Heartbeat = require('./Heartbeat');
const hbInterval = process.env.MCCC_IOT_HEARTBEAT_INTERVAL;

// const attachExitHandler = async (deviceClient) => {
//     const standardInput = process.stdin;
//     standardInput.setEncoding('utf-8');
//     console.log('Please enter q or Q to exit sample.');
//     standardInput.on('data', (data) => {
//       if (data === 'q\n' || data === 'Q\n') {
//         console.log('Clearing intervals and exiting sample.');
//         clearInterval(intervalToken);
//         deviceClient.close();
//         process.exit();
//       } else {
//         console.log('User Input was : ' + data);
//         console.log('Please only enter q or Q to exit sample.');
//       }
//     });
//   };

module.exports = class Client {

    /// IoT Hub Connection String
    constructor(connectionString) {
        this.connectionString = connectionString;
        if (!IoTConnectionString.parse(this.connectionString, ['HostName', 'DeviceId']))
            throw Error("connectionString required for a new Client");
        
    }

    /// Starts the client
    async start() {
        this.client = IoTClient.fromConnectionString(this.connectionString, IoTProtocol);
        const heartbeat = new Heartbeat(hbInterval, this.client);
        try {
            // Add the modelId here
            await this.client.setOptions(modelIdObject);
            await this.client.open();

            // enable Heartbeat
            heartbeat.startHeartbeat();

            // enable Temp-sensor

            // enable door command

            // attach a standard input exit listener
            // attachExitHandler(client);

            // console.log('Enabling the commands on the client');
            // client.onDeviceMethod(commandMaxMinReport, commandHandler);
        
            // // Send Telemetry every 10 secs
            // let index = 0;
            // intervalToken = setInterval(() => {
            //   sendTelemetry(client, index).catch((err) => console.log('error', err.toString()));
            //   index += 1;
            // }, telemetrySendInterval);
               
        
            
        } catch (error) {
            // todo 
        }
    }

    /// Stops the client
    async stop() {

    }
}