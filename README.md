# Distributed Environment Monitor

This project uses a bunch of [Grove - Starter Kit Plus][grove-kit-link] and the [Intel Edison][edison-link] boards to create a distributed set of environment sensors that all report to a realtime dashboard.

All of the devices are managed using [resin.io](https://resin.io/), which allows us to deploy new code updates to them simultaneously. Each device logs light, temperature and noise levels, using the Intel [UPM][upm-link] library that allows you to interface with a couple of different Grove sensors. These sensor readings are then streamed in realtime to [pubnub](pubnub-link).

Additionally each device hosts a small python flask server, which you can see in [server.py](/app/server.py). This server just server the frontend (found in [app/static](/app/static) on `port 80` which you can see on your resin.io device URL.

The frontend dashboard uses [eon](eon-link) project to graph the sensor values from all the connected devices in realtime.

[upm-link]:https://github.com/intel-iot-devkit/upm.git
[edison-link]:http://www.intel.co.uk/content/www/uk/en/do-it-yourself/edison.html
[grove-kit-link]:http://www.seeedstudio.com/depot/Grove-starter-kit-plus-Intel-IoT-Edition-for-Intel-Galileo-Gen-2-and-Edison-p-1978.html
[resin-signup]:https://dashboard.resin.io/signup
[getting-started-link]:http://docs.resin.io/#/pages/installing/gettingStarted-Edison.md
[pubnub-link]:https://www.pubnub.com/
[eon-link]:https://github.com/pubnub/eon-chart
