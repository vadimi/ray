(function($, _) {

  var utils = {
    setActiveButton: function (selector) {
      $('a[name="control"]').removeClass('ui-btn-active');
      $(selector).addClass('ui-btn-active');
    }
  };

  window.StationModel = Backbone.Model.extend({
    defaults: {
      url: '',
      name: '',
      artist: '',
      track: '',
      time: null,
      playing: false
    }
  });

  //Artist from Last.fm API
  var ArtistModel = Backbone.Model.extend({
    defaults: {
      artist: null,
      bio: null,
      loading: false
    },

    url: function() {
      var urlParams = {
        api_key: '0ddd5f4b5cd487951f5b46d2c4cb2d38',
        format: 'json',
        autocorrect: 1,
        method: 'artist.getInfo',
        artist: this.get('artist')
      };

      return "http://ws.audioscrobbler.com/2.0/?" + $.param(urlParams);
    },

    parse: function(response) {
      if (response && response.artist) {
        if (response.artist.bio)
          response.artist.bio.content = response.artist.bio.content.replace(new RegExp( "\\n", "g" ), "<br />");
        return response.artist;
      }
      return response;
    }
  });

  window.StationView = Backbone.View.extend({
    model: StationModel,

    el: '#listenPage',

    initialize: function() {
      this.template = _.template($('#stationTemplate').html());
    },

    hide: function() {
      this.$el.hide();
    },

    render: function() {
      this.$el = $('#listenPage');
      this.$el.show()
        .html(this.template(this.model.toJSON()))
        .trigger('create');
      return this;
    }
  });

  window.NothingView = Backbone.View.extend({
    el: '#nothing',

    render: function() {
      this.$el = $('#nothing');
      this.$el.show();
      return this;
    },

    hide: function() {
      this.$el.hide();
    }
  });

  var artistViewHelpers = {
    getMediumImage: function() {
      if (_.isArray(this.image)){
        var megaImage = _.find(this.image, function (img) { return img.size === 'mega'; });
        if (megaImage) {
          return megaImage["#text"];
        }
      }
      return null;
    }
  };

  window.ArtistView = Backbone.View.extend({

    model: ArtistModel,

    initialize: function() {
      this.template = _.template($('#artistTemplate').html());
    },

    loadArtist: function(successCallback) {
      var self = this;
      if (this.model.get('artist') && this.model.get('artist').length > 0)
        this.model.fetch({ success: function (model) {
          self.model.set({ loading: false });
          self.renderView();
        }});
    },

    render: function() {
      this.model.set({ loading: true });
      this.renderView();
      this.loadArtist();
      return this;
    },

    renderView: function () {
      this.$el = $('#artist');
      var data = this.model.toJSON();
      _.extend(data, artistViewHelpers);
      this.$el
        .show()
        .html(this.template(data));

      return this;
    },

    hide: function() {
      this.$el.hide();
    }
  });

  window.AppView = Backbone.View.extend({
    model: StationModel,

    currentView: null,

    initialize: function(){
     this.stationView = new StationView({ model: this.model });
     this.nothingView = new NothingView();
     this.artistView = new ArtistView({ model: new ArtistModel() });
     this.model.bind('change', this.render, this);
    },

    events: {
      'vclick #stopButton': 'stopClick',
      'vclick #playButton': 'playClick',
      'vclick #stationButton': 'stationClick',
      'vclick #artistButton': 'artistClick'
    },

    playClick: function() {
      utils.setActiveButton('#playButton');
      var stationName = ray.getPathParam(1);
      ray.connector.play(stationName);
      this.renderView(this.stationView);
    },

    stopClick: function() {
      utils.setActiveButton('#stopButton');
      ray.connector.stop();
      ray.timer.stop();
      this.hideAll();
      this.nothingView.render();
    },

    stationClick: function() {
      this.renderView(this.stationView);
    },

    artistClick: function() {
      this.renderView(this.artistView);
    },

    hideAll: function() {
      this.nothingView.hide();
      if (this.currentView && this.currentView.hide) {
        this.currentView.hide();
      }
    },

    updateViewModels: function() {
      this.model.set({ time: ray.timer.getCurrentTime() }, {silent: true});
      this.stationView.model.set(this.model, {silent: true});
      this.artistView.model = new ArtistModel();
      this.artistView.model.set({ artist: this.model.get('artist') }, {silent: true});
    },

    renderView: function(view) {
      this.hideAll();
      this.updateViewModels();
      if (view) {
        this.currentView = view;
      } else if (!this.currentView) {
        this.currentView = this.stationView;
      }
      this.currentView.render();
      return this;
    },

    render: function(view) {
      return this.renderView();
    }
  });

})(jQuery, _);