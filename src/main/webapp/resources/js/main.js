DeC.Host = Ember.Object.extend({
	name:null,
	id:null
});
DeC.Traffic = Ember.Object.extend({
	host:null,
	history:null,
	trafficPerMillion:null,
	visitorsPerMillionUsers:null,
	dailyInternetUsers:function(){
		var traffic=this.get('trafficPerMillion');
		return traffic*2400;
	}.property('trafficPerMillion')
});

DeC.BulkTrafficLookupRequest = Ember.Object.extend({
	requests:null
});

DeC.TrafficController = Ember.ArrayController.extend({
	hosts:function(){
		var hosts = Ember.A();
		var data = this.get('hostsString');
		DeC.bulkTrafficLookupRequest = DeC.BulkTrafficLookupRequest.create({requests:[]});
		data.split('\n').forEach(function(line) {
			if(objExists(line)) {
				DeC.bulkTrafficLookupRequest.get('requests').pushObject(DeC.Traffic.create({host:line}));	
			}
		});
		return DeC.bulkTrafficLookupRequest;
	}.property('hostsString'),
	hostsString:null,
	lookupTraffic:function(){
		var _this=this;
		$.ajax({
			type:'POST',
			contentType:'application/json',
			url:'rest/TrafficApi/bulkLookup',
			data:JSON.stringify(this.get('hosts'))
		}).done(function(response){
			var content = [];
			response.forEach(function(trafficResponse){
				var traffic = DeC.Traffic.create(trafficResponse);
				content.pushObject(traffic);
			});
			_this.set('content',content);
		});
	},
	init:function(){
		this._super();
	}
});