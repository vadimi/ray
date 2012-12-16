var ray = (function(root, $) {
  function urlPath(a, b) {
    return (a = a.split(/:?\/+/))[+b === b || ~(b = a.indexOf(b)) ? b + 1 : b];
  }

  root.getPathParam = function (index) {
    return urlPath(window.location.pathname, index);
  };

  root.padString = function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  };

  root.isNotEmpty = function(source){
    return source && source.length > 0;
  };

  $(document).on('pagehide', '#rayPage', function(event) {
    var page = jQuery(event.target);
    page.remove();
  });
  return root;
})(ray || {}, jQuery);

ray.home = (function($){

  var root = {};
  var initialized = false;

  root.init = function() {
    ray.connector.init();
    if (initialized)
      return;

    ray.connector.on('stationChanged', function(stationData) {
      if (stationData.playing)
        $('#nowPlaying').show().attr('href', '/stations/' + stationData.internalName);
      else
        $('#nowPlaying').hide();
    });

    ray.connector.on('stop', function() {
      $('#nowPlaying').hide();
    });

    $(document).on('vclick', 'a.station', function() {
      var stationName = $(this).data('stationName');
      ray.connector.play(stationName);
    });

    initialized = true;
  };

  return root;

})(jQuery);

ray.listener = (function ($) {
  var initialized = false;
  var root = {};
  var view;

  root.currentStation = {
    playing: false,
    name: null,
    internalName: null,
    artist: null,
    track: null
  };

  root.init = function (apiKey) {
    ray.connector.init();
    var model = new StationModel();
    view = new AppView({ model: model, el: $('#rayPage') });
    if (initialized) {
      return;
    }

    initialized = true;

    ray.connector.on('stationInfo', function (stationData) {
      updateStation(stationData);
      updateTrack(stationData);
    });
    ray.connector.on('stationChanged', function (stationData) {
      updateStation(stationData);
    });
    ray.connector.on('trackChanged', function (data) {
      updateTrack(data);
    });
  };

  function updateTrack(trackInfo) {
    if (trackInfo && trackInfo.title) {
      var tokens = trackInfo.title.split('-');
      if (tokens && tokens.length == 2) {
        ray.listener.currentStation.artist = $.trim(tokens[0]);
        ray.listener.currentStation.track = $.trim(tokens[1]);
        view.model.set(new StationModel(ray.listener.currentStation));
      }
    }
  }

  function updateStation(stationInfo) {
    if (stationInfo && stationInfo.url) {
      ray.listener.currentStation.url = stationInfo.url;
      ray.listener.currentStation.name = stationInfo.name;
      ray.listener.currentStation.internalName = stationInfo.internalName;
      ray.listener.currentStation.playing = stationInfo.playing;

      var artistTrack = { artist: '', track: '' };
      if (stationInfo.title) {
        var tokens = stationInfo.title.split('-');
        if (tokens && tokens.length == 2) {
          artistTrack.artist = $.trim(tokens[0]);
          artistTrack.track = $.trim(tokens[1]);
        }
      }
      ray.listener.currentStation.artist = artistTrack.artist;
      ray.listener.currentStation.track = artistTrack.track;
      view.model.set(new StationModel(ray.listener.currentStation));
      setActiveButton('#playButton');
      ray.timer.resume('#time');
      } else {
        setActiveButton('#stopButton');
        ray.timer.stop();
        ray.listener.currentStation.playing = false;
      }
    }

    function setActiveButton(selector) {
      $('a[name="control"]').removeClass('ui-btn-active');
      $(selector).addClass('ui-btn-active');
    }

    return root;
})(jQuery);

ray.timer = (function($){

  root = {};
  root.selector = null;
  var startTime = null, timeout;

  root.start = function(selector) {
    ray.timer.stop();
    root.selector = selector;
    startTime = moment();
    ray.timer.printTime();
    timeout = setTimeout(ray.timer.printTime, 1000);
  };

  root.resume = function(selector) {
    if (!startTime) {
      ray.timer.start(selector);
    } else {
      root.selector = selector;
      ray.timer.printTime();
      timeout = setTimeout(ray.timer.printTime, 1000);
    }
  };

  root.stop = function() {
    if (timeout) {
      clearTimeout(timeout);
    }
    startTime = null;
  };

  root.printTime = function() {
    if (startTime) {
      var diff = moment().diff(startTime);
      var duration = moment.duration(diff);
      $(root.selector).text(root.getCurrentTime());
    }
    timeout = setTimeout(ray.timer.printTime, 1000);
  };

  root.getCurrentTime = function() {
    if (startTime) {
      var diff = moment().diff(startTime),
          duration = moment.duration(diff),
          timeString = null;
      timeString =
        ray.padString(duration.hours(), 2) + ':' +
        ray.padString(duration.minutes(), 2) + ':' +
        ray.padString(duration.seconds(), 2);

      return timeString;
    }
    return null;
  };

  return root;

})(jQuery);