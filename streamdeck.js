const { openStreamDeck, listStreamDecks } = require('elgato-stream-deck')
const Jimp = require('jimp')

let myStreamDeck = null

function streamDeckInit () {
  if (myStreamDeck === null) {
    try {
      myStreamDeck = openStreamDeck()
    } catch (error) {
      console.error('Error opening Stream Deck device', error)
    }
    if (myStreamDeck) {
      myStreamDeck.on('error', error => {
        console.error(error)
      })
    }
  }
}

module.exports = function (RED) {
  function StreamDeckKeyInput (config) {
    RED.nodes.createNode(this, config)
    var node = this
    streamDeckInit()
    if (myStreamDeck) {
      myStreamDeck.on('up', keyIndex => {
        node.send({ topic: keyIndex, payload: 1 }) // TODO: change to key press duration
      })
      myStreamDeck.on('down', keyIndex => {
        node.send({ topic: keyIndex, payload: 0 })
      })
    }
  }

  
  /*
   *   CLEAR KEY
   */
  function StreamDeckClearKey (config) {
    RED.nodes.createNode(this, config)
    var node = this
    streamDeckInit()
    node.on('input', function (msg) {
      if (myStreamDeck) {
        const keyIndex = parseInt(msg.topic);

        if(keyIndex == -1) {
          try {
            myStreamDeck.clearAllKeys()
          } catch (error) {
            node.error('Can\'t write to StreamDeck', msg)
          }
            break
        } else {
          try {
            myStreamDeck.clearKey(keyIndex)
          } catch (error) {
            node.error('Can\'t write to StreamDeck', msg)
          }
        }
      }
    });
    node.on('close', function () {
      myStreamDeck.close()
      myStreamDeck = null
    })
  }

  /*
   *  SET BRIGHTNESS
   */
  function StreamDeckSetBrightness (config) {
    RED.nodes.createNode(this, config)
    var node = this
    streamDeckInit()
    node.on('input', function (msg) {
      if (myStreamDeck) {
        try {
          myStreamDeck.setBrightness(msg.payload.value)
        } catch (error) {
          node.error('Can\'t write to StreamDeck', msg)
        }
      }
    });
    node.on('close', function () {
      myStreamDeck.close()
      myStreamDeck = null
    })
  }
        
  /*
   *  SET IMAGE
   */
  function StreamDeckSetImage (config) {
    RED.nodes.createNode(this, config)
    var node = this
    streamDeckInit()
    node.on('input', function (msg) {
      if (myStreamDeck) {
        const keyIndex = parseInt(msg.topic);

        Jimp.read(msg.payload.image, (err, image) => {
          if (err) {
            node.error(err, msg)
            return
          }
          image = image.resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE).bitmap.data
          const finalBuffer = Buffer.alloc(myStreamDeck.ICON_SIZE ** 2 * 3)
          for (let p = 0; p < image.length / 4; p++) {
            image.copy(finalBuffer, p * 3, p * 4, p * 4 + 3)
          }
          try {
            if(keyIndex >= 0) {
              myStreamDeck.fillImage(keyIndex, finalBuffer)
            } else {
              for(var i=0; i<myStreamDeck.KEY_COLUMNS * myStreamDeck.KEY_ROWS; i++) {
                myStreamDeck.fillImage(i, finalBuffer)
              }
            }
          } catch (error) {
            node.error('Can\'t write to StreamDeck', msg)
          }
        })
      }
    });
    node.on('close', function () {
      myStreamDeck.close()
      myStreamDeck = null
    })
  }
            
  /*
   *  SET COLOR
   */     
  function StreamDeckSetColor (config) {
    RED.nodes.createNode(this, config)
    var node = this
    streamDeckInit()
    node.on('input', function (msg) {
      if (myStreamDeck) {
        const keyIndex = parseInt(msg.topic);

        try {
          if(keyIndex >= 0) {
            myStreamDeck.fillColor(keyIndex, ...msg.payload.value)
          } else {
            for(var i=0; i<myStreamDeck.KEY_COLUMNS * myStreamDeck.KEY_ROWS; i++) {
              myStreamDeck.fillColor(i, ...msg.payload.value)
            }
          }
        } catch (error) {
          node.error('Can\'t write to StreamDeck', msg)
        }
      }
    });
    node.on('close', function () {
      myStreamDeck.close()
      myStreamDeck = null
    })
  }
            
  /*
   *  SET TEXT
   */  
  function StreamDeckSetText (config) {
    RED.nodes.createNode(this, config)
    var node = this
    streamDeckInit()
    node.on('input', function (msg) {
      if (myStreamDeck) {
        const keyIndex = parseInt(msg.topic);
        // msg.payload
        node.error('WIP function used', msg)
        return
      }
    });
    node.on('close', function () {
      myStreamDeck.close()
      myStreamDeck = null
    })
  }
      
  RED.nodes.registerType('streamdeck-keyInput', StreamDeckKeyInput)
  RED.nodes.registerType('streamdeck-clearKey', StreamDeckClearKey)
  RED.nodes.registerType('streamdeck-setBrightness', StreamDeckSetBrightness)
  RED.nodes.registerType('streamdeck-setImage', StreamDeckSetImage)
  RED.nodes.registerType('streamdeck-setColor', StreamDeckSetColor)
  RED.nodes.registerType('streamdeck-setText', StreamDeckSetText)
  
  //RED.nodes.registerType('streamdeck-out', StreamDeckOut)
}
