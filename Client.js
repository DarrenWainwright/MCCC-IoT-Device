
//'use strict'
const IoTProvProtocol = require('azure-iot-provisioning-device-mqtt').Mqtt;
const IoTProtocol = require('azure-iot-device-mqtt').Mqtt;
const IoTClient = require('azure-iot-device').Client;
//const IoTMessage = require('azure-iot-device').Message;
//const IoTConnectionString = require('azure-iot-common').ConnectionString;
const Heartbeat = require('./Heartbeat');
const CryptoJS = require('crypto-js');
const SymmetricKeySecurityClient = require('azure-iot-security-symmetric-key').SymmetricKeySecurityClient;
const ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;


const hbInterval = process.env.MCCC_IOT_HEARTBEAT_INTERVAL;

let deviceConnectionString;

// Provisions the device in IoT Central
async function provisionDevice(deviceId, sasToken, dpsEndpoint, scopeId, modelIdObject) {
    console.log('Proivision Device')
    const deviceKey = generateDeviceKey(deviceId, sasToken);
    var provSecurityClient = new SymmetricKeySecurityClient(deviceId, deviceKey);
    var provisioningClient = ProvisioningDeviceClient.create(dpsEndpoint, scopeId, new IoTProvProtocol(), provSecurityClient);
    provisioningClient.setProvisioningPayload(modelIdObject);

    try {
        let result = await provisioningClient.register();
        deviceConnectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';SharedAccessKey=' + deviceKey;
    } catch (err) {
        console.error("error registering device: " + err.toString());
    }
}

// generate device Key
function generateDeviceKey(deviceId, sasToken) {
    var key = CryptoJS.enc.Base64.parse(sasToken);
    var prehash = CryptoJS.enc.Utf8.parse(deviceId);
    var hash = CryptoJS.HmacSHA256(prehash, key);
    return hash.toString(CryptoJS.enc.Base64);
}
module.exports = class Client {

    constructor(deviceId, sasToken, dpsEndpoint, scopeId, modelId) {
        this.deviceId = deviceId;
        this.sasToken = sasToken;
        this.dpsEndpoint = dpsEndpoint;
        this.scopeId = scopeId;
        this.modelId = modelId;
        this.modelIdObject = { modelId: this.modelId }
    }

    /// Starts the client
    async start() {
        await provisionDevice(this.deviceId, this.sasToken, this.dpsEndpoint, this.scopeId, this.modelIdObject);

        this.client = IoTClient.fromConnectionString(deviceConnectionString, IoTProtocol);
        const heartbeat = new Heartbeat(hbInterval, this.client);
        try {
            // Add the modelId here
            await this.client.setOptions(this.modelIdObject);
            await this.client.open();


            // enable Heartbeat
            heartbeat.startHeartbeat();

        } catch (error) {
            // todo 
        }
    }

    /// Stops the client
    async stop() {

    }
}