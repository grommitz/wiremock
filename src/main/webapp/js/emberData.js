App.ApplicationAdapter = DS.FixtureAdapter;

App.Traffic = DS.Model.extend({
  host                : DS.attr(), 
  trafficPerMillion   : DS.attr(), 
  timestamp           : DS.attr()
});

App.Traffic.FIXTURES = [{
  id: 1,
  host: 'bobbins.net',
  trafficPerMillion: 333.33,
  timestamp: 1371234567890
}, {
  id: 2,
  host: 'bobo.net',
  trafficPerMillion: 101.001,
  timestamp: 1361234567890
}];

