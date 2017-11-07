# ttn2luftdaten_forwarder
forwards data from ttn nodes to luftdaten and madavi.

[On docker hub](https://hub.docker.com/r/cinezaster/ttn2luftdaten_forwarder/)

## Requirements
1. Knowledge how to work with docker and have it installed.
2. Have a Lora Wan node sending PM10 and PM2.5 to the TheThingsNetwork.
3. You need to have a TTN application configured and your sensor Node (Device) connected to it. You'll need the "Application ID" which you can find in the yellow/orange box in the https://console.thethingsnetwork.org/applications page and you'll need the access key which you find at the bottom of the https://console.thethingsnetwork.org/applications/###yourapplicationID### page. (The default key will do) 
4. You need to decide a prefix. Preferably starting with TTN and ending with a place code. For example: TTNBXL = TheThingsNetworkBrussels
5. Your TTN application should output a json object like this 
``` {"pm10":19,"pm25":18,"temperature":16,"humidity":74}```
temperature and humidity are not required. You can achief this by writing a decoder function at this page: https://console.thethingsnetwork.org/applications/###yourapplicationID###/payload-formats that returns an object with the given properties.

### Run
Fill in the xxx parts
```
docker run --env appID=xxx --env accessKey=xxx  --env prefix=xxx cinezaster/ttn2luftdaten_forwarder:latest
```

I run it via docker cloud on a digital ocean node
