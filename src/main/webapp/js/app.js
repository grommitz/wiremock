App = Ember.Application.create();

App.Router.map(function() {
  this.resource('test', function() {
    this.resource('results', {path: '/results'});
  });
  this.route('about');
  this.route('settings');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MIXINS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

App.Settings = Ember.Mixin.create({
  matchingThreshold: 0.1,
  init: function() {
    this.set('matchingThreshold', 0.1);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ROUTES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
App.IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('test');
  }
});

App.TestResultsRoute = Ember.Route.extend(App.Settings, {
  model: function() {
    return Ember.$.getJSON("http://localhost:8089/logo/test").then(
      function(json) {
        return App.SearchResult.create().from(json);
      },
      function(err) {
        toastr['error']('Error getting results');
      }
    )
  }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTROLLERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

App.TestController = Ember.ArrayController.extend(App.Settings, {
  urls: null,
  actions: {
    runTest: function() {
      var urlz = this.get('urls').split('\n');
      toastr['error']('matching ' + urlz[0]);
      this.transitionToRoute('testResults');
    }
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OTHER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

App.SearchResult = Ember.Object.extend({
  start:0,
  pageSize:0,
  end:0,
  totalResults:0,
  results:null,
  init: function() {
    this.set('results',Em.A());
  },
  from: function(json, searchText) {
    this.set('searchText',searchText);
    this.set('start',json.start+1);
    this.set('totalResults', json.totalResults);
    this.set('end', json.start+json.pageSize);
    var _this=this;
    json.results.forEach(function(r) {
      _this.get('results').pushObject(Ember.Object.create(r));
    })
    return this;
  }
})





