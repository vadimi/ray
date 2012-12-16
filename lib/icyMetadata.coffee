StationMeta = require './stationMeta'

class IcyMetadata
  ICY_META_REG = /ICY-META:(\s+)?(.*)/i
  ICY_NAME_REG = /ICY-NAME:(\s+)?(.*)/i
  ICY_URL_REG = /ICY-URL:(\s+)?(.*)/i
  STREAM_TITLE_REG = /StreamTitle=/i

  # Parses ICY metadata strings
  #
  # ICY-META, ICY-NAME, ICY-URL
  @parse: (source) ->
    # check if null or empty
    result = new StationMeta()

    return source unless source? or source.length is 0
    result.title = parseIcyMeta source
    result.name = parseIcyData source, ICY_NAME_REG
    result.url = parseIcyData source, ICY_URL_REG

    result

  @hasIcyMetaInfo: (source) ->
    return ICY_META_REG.test source if source?
    return false

  parseIcyData = (source, regex) ->
    if source?
      matches = source.match regex
      return matches[2] if matches? and matches.length is 3
    null

  parseIcyMeta = (source) ->
    return null unless source? or source.length is 0

    meta = parseIcyData source, ICY_META_REG

    return null unless meta?

    tokens = meta.split ';'
    for token in tokens
      if STREAM_TITLE_REG.test token
        title = token.replace STREAM_TITLE_REG, ''
        return trim title, '\''

  # Trim symbol from start and end of string
  trim = (source, char) ->
    return source unless source? or source.length is 0

    if source.indexOf(char) is 0
      source = source.substr 1
    if source.indexOf char is source.length - 1
      source = source.substr 0, source.length - 1

    source

module.exports = IcyMetadata