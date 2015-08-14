#!/usr/bin/python

import os, time
from Pubnub import Pubnub

import pyupm_i2clcd as lcd
import pyupm_grove as grove
import pyupm_mic as upmMicrophone

# Attach microphone to analog port A2
myMic = upmMicrophone.Microphone(2)
threshContext = upmMicrophone.thresholdContext()
threshContext.averageReading = 0
threshContext.runningAverage = 0
threshContext.averagedOver = 2

# Create the light sensor object using AIO pin 0
lightLevel = grove.GroveLight(0)

# Create the temperature sensor object using AIO pin 1
temp = grove.GroveTemp(1)

# Initialize Jhd1313m1 at 0x3E (LCD_ADDRESS) and 0x62 (RGB_ADDRESS)
myLcd = lcd.Jhd1313m1(0, 0x3E, 0x62)
myLcd.setCursor(0,0)
# RGB Blue
myLcd.setColor(53, 39, 249)

pubKey = os.getenv("PUBLISH_KEY")
subKey = os.getenv("SUBSCRIBE_KEY")
channel = os.getenv("CHANNEL")
updatePeriod = int(os.getenv("PERIOD"),30)
print('update period is: '+ str(updatePeriod))
pubnub = Pubnub(publish_key=pubKey, subscribe_key=subKey, ssl_on=True)

def publishData(channelName,data):
    message = buildMessage(data)
    print message
    # Synchronous pubnub call
    print pubnub.publish(channel=channelName, message=message)

def buildMessage(sensorList):
    timeStamp = int(time.time()*1000) #scale by 1000 so eon displays correctly
    data = [["x",timeStamp]]
    for unit in sensorList:
        data.append([unit,sensorList[unit]])

    return {"columns":data}

def getNoiseLevel():
    buf = upmMicrophone.uint16Array(128)
    buflen = myMic.getSampledWindow(2, 128, buf)
    if buflen:
        thresh = myMic.findThreshold(threshContext, 30, buf, buflen)
        if(thresh):
            return thresh

while 1:
    start = time.time()
    end1 = time.time()
    noiseLevel = getNoiseLevel()
    end2 = time.time()

    luxValue = int(lightLevel.value())
    end3 = time.time()
    tempValue = int(temp.value())
    end4 = time.time()

    myLcd.setCursor(0,0)
    myLcd.write('Light: ' + str(luxValue) + ' Lux')
    myLcd.setCursor(1,0)
    myLcd.write('temp: ' + str(tempValue) + ' C')

    sensors = {"lux":luxValue,"temp":tempValue,"noise":noiseLevel} #,"dust":int(dustData.ratio)}
    #publishData(channel,sensors)
    end5 = time.time()

    print('total execution time: '+str(end5-start))
    print('dust exec time: '+str(end1-start))
    print('noise exec time: '+str(end2-end1))
    print('lux exec time: '+str(end3-end2))
    print('temp exec time: '+str(end4-end3))
    time.sleep(updatePeriod)

# Delete the light sensor object
del lightLevel
del temp
del myMic
