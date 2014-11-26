App = Ember.Application.create();

App.Router.map(function() {
  this.resource('mtest', function() {
    this.resource('mresults', {path: '/results'});
  });
  this.resource('training', {path: '/training'});
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
    this.transitionTo('mtest');
  }
});

App.MresultsRoute = Ember.Route.extend(App.Settings, {
  model: function(params) {
    var kw = this.controllerFor('mtest').get('kw');
    if (kw === null) {
      toastr['error']('No keywords');
      this.transitionTo('mtest');
      return;
    }
    var logo = this.controllerFor('mtest').get('selectedLogo');
    if (logo === null) {
      toastr['error']('No logo selected');
      this.transitionTo('mtest');
      return;
    }
    toastr['info']('Querying google images for \"' + kw + '\" and matching the images against ' + logo.name + '...');
    return Ember.$.getJSON("http://localhost:8089/logo/test").then(
      function(json) {
        console.log(json);
        return App.SearchResult.create().from(json);
      },
      function(err) {
        toastr['error']('Error fetching results');
      }
    );
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTROLLERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var nike = {id: 12345, name: 'nike'}
var adidas = {id: 98765, name: 'adidas'};

App.MtestController = Ember.ArrayController.extend(App.Settings, {
  logos: [ nike, adidas ],
  selectedLogo: null,
  kw: null,
  actions: {
    runTest: function() {
      this.transitionToRoute('mresults');
    }
  }
});

App.MresultsController = Ember.ObjectController.extend(App.Settings, {
  end: function() {
    return this.get('start') + this.get('pageSize') - 1;
  }.property()
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OTHER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

App.SearchResult = Ember.Object.extend({
  searchText:null,
  start:0,
  totalResults:0,
  pageSize:0,
  results:null,
  init: function() {
    this.set('results',Em.A());
  },
  from: function(json, searchText) {
    this.set('searchText', searchText);
    this.set('start', json.start + 1);
    this.set('totalResults', json.totalResults);
    this.set('pageSize', json.pageSize);
    var _this=this;
    if (json.results !== undefined) {
      json.results.forEach(function(r) {
        console.log(r);
        var o = Ember.Object.create(r);
        _this.get('results').pushObject(o); //Ember.Object.create(r));
      });
    }
    return this;
  }
})


//App.ApplicationController = Ember.ObjectController.extend({
//  logos: [ nike, adidas ]
//});




