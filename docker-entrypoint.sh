#!/bin/bash

# trigger udev, so /dev gets refreshed copy at startup
#udevd &
udevadm trigger

# Let it rest
sleep 1

# run the python example
python /usr/src/app/server.py &
python /usr/src/app/main.py
