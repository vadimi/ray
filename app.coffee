express = require 'express'
ErrorHandler = require './lib/errorHandler'
config = require './lib/rayConfig'
logger = require './lib/logger'
Tuner = require './lib/tuner'

app = module.exports = express.createServer()

# Configuration

app.configure ->
  app.use express.cookieParser()
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'

  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.compress()
  #app.use express.staticCache()
  app.use express.static __dirname + '/public'
  app.use app.router
  app.use(ErrorHandler.error)

app.configure 'development', ->
  app.use express.errorHandler
    dumpExceptions: true, showStack: true
  app.set 'view options',
    layout: false
    pretty: true

app.configure 'production', ->
  app.use express.errorHandler()
  app.set 'view options',
    layout: false
    pretty: false

# Routes
require('./routes') app

app.listen config.appPort
new Tuner app

console.log('Express server listening on port %d in %s mode', app.address().port, app.settings.env)
logger.info("Express server listening on port #{app.address().port} in #{app.settings.env} mode")
