{stations} = require '../stations.json'

# Get stations information from json file
class Station

  Object.defineProperty @, 'all',
    get: -> stations

  # Get station by index from corresponding stations array
  #
  # index - number that represents index of a station in array
  @get = (index) ->
    if stations? and stations.length > index then stations[index] else null

  # Get station by station name
  #
  # index - station name
  @getByName = (name) ->
    st = (station for station in stations when station.name is name)
    return if st? and st.length > 0 then st[0] else null

module.exports = Station