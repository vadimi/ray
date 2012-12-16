io = require 'socket.io'
radio = require './radio'
logger = require './logger'
config = require './rayConfig'
Stations = require './stations'
player = require './mpgPlayer'

class Tuner
  constructor: (@app) ->
    @setup()

  setup: ->
    sio = io.listen @app
    config.initSocketIO sio
    @setupRadio()

    sio.on 'error', (reason) ->
      logger.error(reason)

    sio.sockets.on 'connection', (socket) =>
      socket.emit 'stationInfo', radio.current

      socket.on 'stop', () -> radio.stop()

      socket.on 'play', (stationName) ->
        radio.once 'stopped', () ->
          if stationName?
            station = Stations.getByName decodeURIComponent(stationName)
            radio.playStation station if station?
        radio.stop()

      socket.on 'reconnect', () ->
        socket.emit 'stationInfo', radio.current

    # send trackChanged to all connected clients
    radio.on 'trackChanged', (track) ->
      sio.sockets.emit 'trackChanged', track

    # send stationChanged to all connected clients
    radio.on 'stationChanged', (station) ->
      sio.sockets.emit 'stationChanged', station

  # configure radio. mpg123 is the default one
  setupRadio: ->
    radio.player = player if radio.player is null or radio.player.name isnt player.name

module.exports = Tuner