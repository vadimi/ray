{EventEmitter} = require 'events'
{spawn} = require 'child_process'
IcyMetadata = require './icyMetadata'

class MpgPlayer extends EventEmitter
  constructor: ->
    @mpg = null

  Object.defineProperty @prototype, 'name',
    get: -> "mpg123"

  play: (url) ->
    if @mpg is null or @mpg.killed
      @mpg = spawn 'mpg123', [url]

      @attachHandlers(@mpg)

    return

  attachHandlers: ->
    @mpg.stderr.on 'data', (data) =>
      @processStreamData data

    @mpg.on 'exit', (data) =>
      console.log 'exit'
      @emit 'stopped'

    return

  processStreamData: (data) ->
    stringData = data.toString()
    stationMeta = IcyMetadata.parse stringData
    if stationMeta.hasData
      stationMeta.playing = true
      eventType = if IcyMetadata.hasIcyMetaInfo stringData then 'trackChanged' else 'stationChanged'
      @emit eventType, stationMeta

  stop: ->
    if @mpg? and not @mpg.killed
      @mpg.kill 'SIGINT'
    else
      @emit 'stopped'
      return

module.exports = new MpgPlayer()