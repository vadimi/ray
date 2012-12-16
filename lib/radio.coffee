{EventEmitter} = require 'events'
StationMeta = require './stationMeta'

class Radio extends EventEmitter
  constructor: () ->
    @current = new StationMeta()
    @test = null
    @playerObj = null

  Object.defineProperty @prototype, 'player',
    get: -> @playerObj
    set: (value) ->
      # stop playing
      @stop()

      @playerObj = value

      @playerObj.on 'trackChanged', (track) =>
        if @current.title isnt track.title
          @current.title = track.title
          @emit 'trackChanged', @current

      @playerObj.on 'stationChanged', (station) =>
        @current.playing = true
        @current.name = station.name if station.name?
        @current.url = station.url if station.url?
        @emit 'stationChanged', @current

      @playerObj.on 'stopped', () =>
        @emit 'stopped'

  playStation: (station) ->
    @current.internalName = station.name
    @player.play station.url if @player?

  stop: ->
    if @player?
      @current = new StationMeta()
      @player.stop()

module.exports = new Radio()