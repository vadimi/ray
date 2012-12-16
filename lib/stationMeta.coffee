class StationMeta
  constructor: ->
    @internalName = null
    @name = null
    @url = null
    @title = null
    @playing = false

  Object.defineProperty @.prototype, 'hasData',
    get: -> @title? or @name? or @url?

module.exports = StationMeta