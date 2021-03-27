require('dotenv').config({path: __dirname + '/.env'});
const Client = require('./Client');

/// app entry point
async function main(){

    const deviceClient = new Client(process.env.MCCC_IOT_HUB_CONNECTION_STRING);
    await deviceClient.start();

    //todo - listen to stop it
}


//let c = new Client();




main().then(()=> console.log('Device closed down')).catch((err) => console.log('error', err));
