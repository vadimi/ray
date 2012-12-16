class Route
  delegate: (method) ->
    () => method.apply @, arguments

module.exports = Route