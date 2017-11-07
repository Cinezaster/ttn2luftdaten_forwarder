# ttn2luftdaten_forwarder
forwards data from ttn nodes to luftdaten and madavi
[On docker hub] (https://hub.docker.com/r/cinezaster/ttn2luftdaten_forwarder/)

## Requirements
1. Knowledge how to work with docker and have it installed.
2. Have a Lora Wan node sending PM10 and PM2.5 to the TheThingsNetwork
3. You need to have a TTN application configured and your sensor Node (Device) connected to it. You'll need the "Application ID" which you can find in the yellow/orange box in the https://console.thethingsnetwork.org/applications page and you'll need the access key which you find at the bottom of the https://console.thethingsnetwork.org/applications/###yourapplicationID### page. (The default key will do) 
4. You need to decide a prefix. Preferably starting with TTN and ending with a place code. For example: TTNBXL = TheThingsNetworkBrussels

### Run
Fill in the xxx parts
```docker run --env appID=xxx --env accessKey=xxx  --env prefix=xxx cinezaster/ttn2luftdaten_forwarder:latest```

I run it via docker cloud on a digital ocean node
