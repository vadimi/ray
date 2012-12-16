Route = require './route'
Stations = require '../lib/stations'
NotFound = require '../lib/notFound'
player = require '../lib/mpgPlayer'
radio = require '../lib/radio'
config = require '../lib/rayConfig'

class StationsRoute extends Route

  # app - Expressjs application
  init: (app) ->
    app.get('/', @delegate @index)
    app.get('/stations/:name', @delegate @viewStation)
  
  index: (req, res) ->
    res.render "index", stations: Stations.all

  viewStation: (req, res) ->
    station = Stations.getByName req.params.name
    res.render "listen", { station: station, current: radio.current, apiKey: config.lastFmApiKey }

  ###playStation: (req, res) ->
    radio.stop()
    station = Stations.getByName req.params.name
    radio.playStation station
    res.json true###

module.exports = StationsRoute