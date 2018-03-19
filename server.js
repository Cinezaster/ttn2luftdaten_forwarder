'use strict'

const request = require('request')
const ttn = require('ttn')

const log = (logMessage) => {
  process.stdout.write(logMessage + '\n')
}

if (process.env.appID === undefined || process.env.accessKey === undefined || process.env.prefix === undefined) {
  log('Provide \'appID\' & \'accessKey\' & \'prefix\' for your ttn application with the environment')
  process.exit(1)
}

const appID = process.env.appID
const accessKey = process.env.accessKey
const prefix = process.env.prefix

const sendData = (url, payload, deviceId, XPin) => {
  const options = {
    headers: {
      'X-Pin': XPin,
      'X-Sensor': deviceId
    },
    method: 'POST',
    url: url,
    json: {
      sensordatavalues: payload
    }
  }

  request(options)
}

ttn.data(appID, accessKey)
    .then((client) => {
      client.on('uplink', (devID, payload) => {
        const deviceId = prefix + '-' + parseInt(payload.hardware_serial, 16)
        log('Forwarding data from device: ' + devID + ' [' + deviceId + ']')
        log('data: ' + JSON.stringify(payload.payload_fields))

        if (payload.payload_fields.pm10 && payload.payload_fields.pm25) {
          const pmPayload = [
            {value_type: 'P1', value: payload.payload_fields.pm10.toString()},
            {value_type: 'P2', value: payload.payload_fields.pm25.toString()}
          ]
          sendData('https://api.luftdaten.info/v1/push-sensor-data/', pmPayload,deviceId , 1)
          const hpm_pmPayload = [
            {value_type: 'HPM_P1', value: payload.payload_fields.pm10.toString()},
            {value_type: 'HPM_P2', value: payload.payload_fields.pm25.toString()}
          ]
          sendData('https://api-rrd.madavi.de/data.php', hpm_pmPayload, deviceId, 1)
        }

        if (payload.payload_fields.temperature && payload.payload_fields.humidity) {
          const dhtPayload = [
            {value_type: 'temperature', value: payload.payload_fields.temperature.toString()},
            {value_type: 'humidity', value: payload.payload_fields.humidity.toString()}
          ]
          sendData('https://api.luftdaten.info/v1/push-sensor-data/',dhtPayload, deviceId, 7)
          sendData('https://api-rrd.madavi.de/data.php',dhtPayload, deviceId, 7)
        }
      })
    })
    .catch(function (err) {
      log(err)
      process.exit(1)
    })
