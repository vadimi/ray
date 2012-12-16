ray.connector = (function($) {

	var connector = {};
	var socket = null, initialized = false;

	connector.init = function() {
		if (initialized) {
      socket.emit('reconnect');
      return;
    }

    //iOS 6 bug - it caches POST requests
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
      if (/OS 6_/.test(navigator.userAgent)) {
        options.data = jQuery.param($.extend(originalOptions.data||{}, {
          timeStamp: new Date().getTime()
        }));
      }
    });

    _.extend(connector, Backbone.Events);
    initialized = true;
    socket = io.connect(location.protocol + '//' + location.host);
    socket.on('stationInfo', function (data) {
      connector.trigger('stationChanged', data);
    });
    socket.on('stationChanged', function (data) {
      connector.trigger('stationChanged', data);
    });
    socket.on('trackChanged', function (data) {
      connector.trigger('trackChanged', data);
    });
	};

  connector.play = function(stationName) {
    socket.emit('play', stationName);
  };

	connector.stop = function() {
		socket.emit('stop');
		connector.trigger('stop');
	};

	return connector;

})(jQuery);