module.exports = (app) ->
  ['stationsRoute'].forEach(
    (routeName) ->
      route = require("./#{routeName}")
      routeObj = new route()
      routeObj.init(app) if routeObj.init
  )