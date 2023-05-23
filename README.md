# node-red-contrib-streamdeck-plus

WIP Fork - Nothing works so far, come back quite later !

## Linux setup

On Linux, you will need to add these to `/etc/udev/rules.d/50-elgato.rules` :

```
SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEM=="usb", ATTRS{idVendor}=="0fd9", ATTRS{idProduct}=="0060", MODE:="666", GROUP="plugdev"
SUBSYSTEM=="usb", ATTRS{idVendor}=="0fd9", ATTRS{idProduct}=="0063", MODE:="666", GROUP="plugdev"
SUBSYSTEM=="usb", ATTRS{idVendor}=="0fd9", ATTRS{idProduct}=="006c", MODE:="666", GROUP="plugdev"
SUBSYSTEM=="usb", ATTRS{idVendor}=="0fd9", ATTRS{idProduct}=="006d", MODE:="666", GROUP="plugdev"
```

And run `sudo udevadm control --reload-rules`

Installing this mightalso  require you to install the following packages : `libusb-1.0-dev` and either `libudev-dev` or `eudev-dev`

# Usage

## keyInput
Returns the following :
- `msg.topic` : key's index
- `msg.payload` : keypress duration (will be 0 for "key down" and always a strictly greater than 0 integer for "key up")

## clearKey
- `msg.topic` : key's index (-1 to clear all)

## setBrightness
- `msg.topic` : key's index
- `msg.payload` : integer value (0-100)

## setImage
- `msg.topic` : key's index
- `msg.payload` : path/url/buffer data of image

## setColor
- `msg.topic` : key's index
- `msg.payload` : hex value of color to fill

## setText
- `msg.topic` : key's index
- `msg.payload` : Object with the following properties
  - `text` : the text to display, line returns must be included
  - `font`: path to the custom font file _(default ???)_
  - `fontSize`: integer for font size _(default 10)_
  - `centered` : true or false _(true by default)_
  - `backgroundColor` : hex value for background color _(transparent by default)_
  - `backgroundImage` : path/url/buffer data of image _(none by default)_
  - `textColor`: hex value for text color _(white by default)_
  - `disableCache`: disable caching _(false by default)_

Will generate an image with the text and set it like setImage. By default the image will be cached as a PNG for faster processing the following times.

## listStreamDecks
Will list the available Stream Decks in debug data

