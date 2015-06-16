## Adafruit UART

UART example using an Arduino and [Adafruit's Bluefruit LE](http://www.adafruit.com/products/1697) breakout board.

Use the [callbackEcho sketch](https://github.com/adafruit/Adafruit_nRF8001/blob/master/examples/callbackEcho/callbackEcho.ino) and see [Adafruit's tutorial](https://learn.adafruit.com/getting-started-with-the-nrf8001-bluefruit-le-breakout/software-uart-service) for setting up the hardware and Arduino code.

Hardware

 * [Arduino](http://www.adafruit.com/products/50)
 * [BluefruitLE](http://www.adafruit.com/products/1697)

This example will also connect to the [Adafruit Bluefruit LE Friend](https://www.adafruit.com/products/2267).

Install

    $ cordova platform add android ios
    $ cordova plugin add com.megster.cordova.ble
    $ cordova run

