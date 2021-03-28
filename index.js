require('dotenv').config({path: __dirname + '/.env'});
const Client = require('./Client');
const deviceId = process.env.MCCC_IOT_DEVICEID;
const sas = process.env.MCCC_IOT_SAS_TOKEN;
const dpsEndpoint = process.env.MCCC_IOT_DPS_ENDPOINT;
const scopeId = process.env.MCCC_IOT_DPS_SCOPEID;

/// app entry point
async function main(){

    const deviceClient = new Client(deviceId, sas, dpsEndpoint, scopeId);
    await deviceClient.start();

    //todo - listen to stop it
}


//let c = new Client();

(async () => {
    try {
        await main();
    } catch (e) {
        // Deal with the fact the chain failed
        console.log('uh oh..');
        console.log(e);
    }
})();


//main().then(()=> console.log('Device closed down')).catch((err) => console.log('error', err));
