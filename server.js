'use strict';

const express = require('express');
var ttn = require("ttn")

var request = require('request');

var options;

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(info.stargazers_count + " Stars");
    console.log(info.forks_count + " Forks");
  }
}

console.log(process.env);

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

const appID = ""
const accessKey = ""

// discover handler and open mqtt connection
ttn.data(appID, accessKey)
  .then(function (client) {
    client.on("uplink", function (devID, payload) {

      if (payload.dev_id.indexOf("toon_n_") > -1) {
        console.log("Received uplink from ", devID)
        console.log(payload.payload_fields)
        console.log(payload.metadata.gateways)

        options = {
          headers: {
            'X-Pin': 1,
            'X-Sensor': 'TTNBXL-'+parseInt(payload.hardware_serial,16)
          },
          method: 'POST',
          url: 'https://api-rrd.madavi.de/data.php',
          json: {
            software_version : 'TTNBXL-v1',
            sensordatavalues : [
              {value_type: 'P1', value: payload.payload_fields.pm10.toString()},
              {value_type: 'P2', value: payload.payload_fields.pm25.toString()}
            ]
          }
        }
        request(options);
        options = {
          headers: {
            'X-Pin': 7,
            'X-Sensor': 'TTNBXL-'+parseInt(payload.hardware_serial,16)
          },
          method: 'POST',
          url: 'https://api-rrd.madavi.de/data.php',
          json: {
            software_version : 'TTNBXL-v1',
            sensordatavalues : [
              {value_type: 'temperature', value: payload.payload_fields.temperature.toString()},
              {value_type: 'humidity', value: payload.payload_fields.humidity.toString()}
            ]
          }
        }
        request(options);
      }
    })
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })

// discover handler and open application manager client
/*ttn.application(appID, accessKey)
  .then(function (client) {
    return client.get()
  })
  .then(function (app) {
    console.log("Got app", app)
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })
*/
