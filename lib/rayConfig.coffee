config = require '../config.json'

class RayConfig
  transports = [
      'websocket'
      'flashsocket'
      'htmlfile'
      'xhr-polling'
      'jsonp-polling'
    ]
    
  @init = (configJson) ->
    # Express application port
    @appPort = configJson.appPort

    #last.fm api key
    @lastFmApiKey = configJson.lastfm_api_key

  @initSocketIO = (sio) ->
    sio.configure 'development', ->
      sio.enable 'browser client minification'

      sio.set 'transports', transports

    sio.configure 'production', ->
      sio.enable 'browser client minification'
      # commented out until the issue with gzip is not resolved
      sio.enable 'browser client gzip'
      sio.enable 'browser client etag'
      sio.set 'log level', 1

      sio.set 'transports', transports

  @init(config)
module.exports = RayConfig
