//Hides when controller.content is empty
Env.HiddenWhenEmpty = Ember.Mixin.create({
	hidden: function() {
		return !objExists(this.get('targetObject.content')) ||
				this.get('targetObject.content').length === 0;
	}.property('targetObject.content')
});

De3.SelectAllButton = De3.IconButton.extend(Env.HiddenWhenEmpty,{
	title:'Select all results on the page',
	action:'selectAllRowsOnPage',
	imageUrl: 'resources/images/newIcons/64x64/selectAll.png'
});

De3.ClearAllSelectionsButton = De3.IconButton.extend(Env.HiddenWhenEmpty,{
	title:'Clear all selections',
	action:'clearAllSelectedRows',
	imageUrl: 'resources/images/newIcons/64x64/unselectAll.png'
});

De3.FirstPageButton = De3.IconButton.extend(Env.HiddenWhenEmpty,{
	title:'Go to first Page',
	disable: function() {

		if (this.get('targetObject').weAreOnTheFirstPage()) {
			this.set('disabled', 'disabled');
		} else {
			this.set('disabled', null);
		}
	}.observes('targetObject.content'),
	action:'firstPage',
	imageUrl: 'resources/images/newIcons/64x64/firstPage.png'
});

De3.PreviousPageButton = De3.IconButton.extend(Env.HiddenWhenEmpty,{
	title:'Previous page',
	disable: function() {
		if (this.get('targetObject').weAreOnTheFirstPage()) {
			this.set('disabled', 'disabled');
		} else {
			this.set('disabled', null);
		}
	}.observes('targetObject.content'),
	action:'previousPage',
	imageUrl: 'resources/images/newIcons/64x64/previous.png'
});

De3.NextPageButton = De3.IconButton.extend(Env.HiddenWhenEmpty,{
	title:'Next Page',
	disable: function() {
		if (this.get('targetObject').weAreOnTheLastPage()) {
			this.set('disabled', 'disabled');
		} else {
			this.set('disabled', null);
		}
	}.observes('targetObject.content'),
	action:'nextPage',
	imageUrl: 'resources/images/newIcons/64x64/next.png'
});

De3.LastPageButton = De3.IconButton.extend(Env.HiddenWhenEmpty,{
	title:'Go to the last page',
	disable: function() {
		if (this.get('targetObject').weAreOnTheLastPage()) {
			this.set('disabled', 'disabled');
		} else {
			this.set('disabled', null);
		}
	}.observes('targetObject.content'),
	action:'lastPage',
	imageUrl: 'resources/images/newIcons/64x64/lastPage.png'
});
Env.Jsonable = Ember.Mixin.create({
	skipProperties:['skipProperties',
				'isInstance',
				'concatenatedProperties',
				'isDestroyed',
				'isDestroying',
				'toString'],
    getJson: function() {
		var _this=this;
        var v, ret = [];
        for (var key in this) {
                v = this[key];
                if ($.inArray(key,_this.get('skipProperties'))!=-1) {
                    continue;
                } // ignore useless items
                if (Ember.typeOf(v) === 'function') {
                    continue;
                }
                ret.push(key);
            }
        return this.getProperties(ret);
    }
});
De3.DataFilter = Ember.Object.extend(Env.Jsonable,{
	startNumber:null,
	resultsNumber:null,
	searchText:null,
	sort:null,
	startDate:null,
	endDate:null,
	resetPageIndex:function(){
		this.set('startNumber',0);
	}.observes('searchText'),
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'startNumber',0);
		De3.setDefaultProperty(this,'resultsNumber',50);
	}
});

De3.DataTableFooterView = Ember.View.extend({
	templateName: 'dataTableFooter_template',
	start: function() {
		var startNumber = this.get('controller.start');
		return ++startNumber;
	}.property('controller.start'),
	pageEnd: function() {
		var pageEnd = this.get('controller.start') + this.get('controller.pageSize');
		if (pageEnd > this.get('controller.totalResults')) {
			pageEnd = this.get('controller.totalResults');
		}
		return pageEnd;
	}.property('controller.start', 'controller.totalResults'),
	pageSizeBinding: 'controller.pageSize',
	totalResultsBinding: 'controller.totalResults',
	resultsBinding: 'controller.content'
});

De3.DataTableBody = Ember.View.extend({
	classNames:['richdatatable','resultsViewBody'],
	tagName:'section',
	overflow:'visible',
	style:function(){
		return 'word-break: break-all;overflow:'+this.get('overflow')+';';
	}.property('overflow'),
	attributeBindings:['style']
});

De3.DefaultDataTableBody = Ember.CollectionView.extend({
	classNames:['richdatatable','resultsViewBody'],
	tagName:'section',
	overflow:'visible',
	contentBinding:'parentView.controller.content',
	controllerBinding:'parentView.controller',
	itemViewClass:Ember.View.extend({
		tagName:'div',
		contextBinding:'content',
		style:"width:100%;",
		attributeBindings:['data-focus','data-selected','data-rowid'],
		classNames:"row",
		"data-focus":function(){return this.get('content.focused');}.property('content.focused'),
		"data-selected":function(){return this.get('content.selected');}.property('content.selected'),
		"data-rowid":function(){return this.get('content.id');}.property('content.id'),
		templateBinding:'parentView.parentView.template',
		didInsertElement:function(){
			var _this=this;
			var id = this.$().attr('data-rowid');
			this.$().fastClick(function(e){
				e.stopPropagation();
				_this.get('parentView.parentView').selectRow({id:id});
			});
		}
	}),
	style:function(){
		return 'word-break: break-all;overflow:'+this.get('overflow')+';';
	}.property('overflow'),
	attributeBindings:['style']
});

De3.SimpleDataTableBody = De3.DataTableBody.extend({
	renderBody:function() {
		var content="";
		var _this=this;
		var selectedResults = this.get('parentView.controller.selectedRows');
		var focusedResult = this.get('parentView.controller.focusSelectionId');
		var idPath = _this.get('parentView.controller.idPath');
		this.get('parentView.controller.content').forEach(function(row) {
			row = Ember.Object.create(row);
			if(objExists(selectedResults[row.get(idPath)])) {
				row.selected=selectedResults[row.get(idPath)];
			} else {
				row.selected=null;
			}
			if(row.id===focusedResult) {
				row.focused=1;
			} else {
				row.focused=null;
			}
			content+=_this.get('parentView.rowTemplate')(row);
		});
		this.$().html(content);
		Ember.run.next(function() {
			_this.$().scrollTop(0).unmask();
		});
	},
	contentHtml:function() {
		var _this=this;
		Ember.run.scheduleOnce('afterRender',this,function(){
			_this.renderBody();
		});
	}.observes('parentView.controller.content','isRendered'),
	didInsertElement:function(){
		if(objExists(this.get('parentView.controller.content.firstObject'))) {
			this.renderBody();
		}
	}
});

De3.DataTable = Ember.View.extend({
	tagName:'div',
	overflow:null,
	layoutName:'dataTable_template',
	attributeBindings:['style'],
	selectOnClick:null,
	selectRow:function(row){
		if(this.get('selectOnClick')===true) {
			this.get('controller').selectRow(row.id,1);
		}	
	},
	loading:function(){
		if(objExists(this.$())) {
			if(this.get('controller.loading')===true) {
				this.$().find('.resultsViewBody').mask("Loading...");
			} else {
				this.$().find('.resultsViewBody').unmask();
			}
		}
	}.observes('controller.loading'),
	emptyView:Ember.View.extend({
		templateName:'emptyDataTable_template'
	}),
	bodyView:De3.DefaultDataTableBody.extend({
		controllerBinding:'parentView.controller',
	}),
	footerView:De3.DataTableFooterView.extend({
		controllerBinding:'parentView.controller'
	}),
	onReady:function(){},
	init:function(){
		this._super();
		if(this.get('selectOnClick')!==false) {
			De3.setDefaultProperty(this,'selectOnClick',true);
		}
	}
});


De3.DataTableController = Ember.ArrayController.extend({
	dataFilter:null,
	start:null,
	pageSize:null,
	totalResults:null,
	content:null,
	loading:null,
	service:null,
	focusSelectionId:null,
	selectedRows:null,
	firstSearch:null,
	idPath:null,
	requestMethod:null,
	loadingErrorMessage:null,
	headers:null,
	weAreOnTheFirstPage: function() {
		return this.get('dataFilter.startNumber')===0;
	},
	weAreOnTheLastPage : function() {
		return this.get('dataFilter.startNumber')+this.get('dataFilter.resultsNumber')>=this.get('totalResults');
	},
	previousPage:function() {
		if(this.weAreOnTheFirstPage()) return;
		var newValue = this.get('dataFilter.startNumber')-this.get('dataFilter.resultsNumber');
		if(newValue<0) {
			newValue=0;
		} 
		this.set('dataFilter.startNumber',newValue);
		this.search();
	},
	nextPage: function() { 
		var newStartValue = this.get('dataFilter.startNumber')+this.get('dataFilter.resultsNumber');
		if(newStartValue<this.get('totalResults')) {
			this.set('dataFilter.startNumber',newStartValue);
		}
		this.search();
	},
	firstPage: function() { 
		this.set('dataFilter.startNumber',0);
		this.search();
	},
	lastPage: function() {
		var remainder = this.get('totalResults')%this.get('dataFilter.resultsNumber');
		if(remainder>0) {
			this.set('dataFilter.startNumber',this.get('totalResults')-remainder);
		} else {
			this.set('dataFilter.startNumber',this.get('totalResults')-this.get('dataFilter.resultsNumber'));
		}
		this.search();
	},
	_buildGetParametersFor:function(properties) {
		var dataFilter = this.get('dataFilter');
		var searchRequest="";
		properties.forEach(function(property){
			if(objExists(dataFilter.get(property))) {
				searchRequest+=property+"="+dataFilter.get(property)+"&";
			}
		});
		if(searchRequest.length>0) {
			searchRequest=searchRequest.substring(0, searchRequest.length - 1);
		}
		return searchRequest;
	},
	search:function() {
		var _this=this;
		this.set('firstSearch',true);
		this.set('loading',true);
		var url = this.get('service');
		var searchRequest;
		if(_this.get('requestMethod')==="GET") {
			var searchParams = ["startNumber","resultsNumber","searchText","sort","startDate","endDate"];
			if(objExists(this.get('searchGetParams'))){
				searchParams.pushObjects(this.get('searchGetParams'));
			}
			searchRequest=this._buildGetParametersFor(searchParams);
		} else {
			searchRequest = JSON.stringify(this.get('dataFilter').getJson());
		}
		return $.ajax({
			url:url,
			data:searchRequest,
			type:_this.get('requestMethod'),
			headers:_this.get('headers'),
			contentType:'application/json',
			dataType:'json'
		}).success(function(response) {
			_this._setData(response);
		}).error(function(response) {
			_this.set('content',[]);
			if(response.status!==412 ) {
				new Notification().error(_this.get('loadingErrorMessage'),null,response.responseText);
			}
		}).complete(function(){
			_this.set('loading',false);
		});
	},
	selectRow:function(id,type) {
		if(!objExists(type)) {
			type=1;
		}
		type=parseInt(type);
		if((typeof id) ==="string" && id.length<=16){
			id=parseInt(id);
		}
		var row = this.get('selectedRows')[id];
		if(objExists(row) && row===type) {
			delete this.get('selectedRows')[id];
			if(objExists(this.get('content')) && this.get('content').length>0) {
				this.get('content').filterProperty('id',id).set('firstObject.selected',null);
			}
		} else {
			this.get('selectedRows')[id]=type;
			if(objExists(this.get('content')) && this.get('content').length>0) {
				var rowToSelect = this.get('content').filterProperty('id',id);
				rowToSelect.set('firstObject.selected',type);
			}
		}
		this.notifyPropertyChange('selectedRows');
	},
	focusRow:function(id) {
		var content = this.get('content');
		if(content.length>0) {
			var currentFocusedRow = content.filterProperty('focused',1);
			if(objExists(currentFocusedRow)) {
				currentFocusedRow.set('firstObject.focused',null);
			}
			content.filterProperty('id',id).set('firstObject.focused',1);
		}
		this.set('focusSelectionId',id);
		this.notifyPropertyChange('selectedRows');
	},
	blueSelected:function() {
		return this._getSelectionsByType(1);
	}.property('selectedRows'),
	greenSelected:function(){
		return this._getSelectionsByType(2);
	}.property('selectedRows'),
	yellowSelected:function(){
		return this._getSelectionsByType(3);
	}.property('selectedRows'),
	orangeSelected:function(){
		return this._getSelectionsByType(4);
	}.property('selectedRows'),
	redSelected:function(){
		return this._getSelectionsByType(5);
	}.property('selectedRows'),
	lightSelected:function(){
		return this._getSelectionsByType(6);
	}.property('selectedRows'),
	_getSelectionsByType:function(type) {
		var selections = Ember.A();
		var selectedRows = this.get('selectedRows');
		$.keys(selectedRows).forEach(function(key){
			if(selectedRows[key]===type) {
				selections.pushObject(key);
			}
		});
		return selections;
	},
	_syncSelectionsWithContent:function(){
		var _this=this;
		var content=this.get('content');
		content.filterProperty('selected').setEach('selected',null);
		if(objExists(content) && content.length>0) {
			if(this.get('hasSelections')) {
				$.keys(_this.get('selectedRows')).forEach(function(id){
					var selection = _this.get('selectedRows')[id];
					if((typeof id) ==="string" && id.length<=16){
						id=parseInt(id);
					}
					var rowToSelect = content.filterProperty('id',id);
					if(objExists(rowToSelect)){
						rowToSelect.set('firstObject.selected',selection);
					}
				});
			}
		}
		this.notifyPropertyChange('content');
	}.observes('selectedRows'),
	hasSelections:function(){
		return $.keys(this.get('selectedRows')).length>0;
	}.property('selectedRows'),
	hasFocus:function(){
		var focusId = this.get('focusSelectionId');
		return objExists( focusId && focusId>0);
	}.property('focusSelectionId'),
	selectAllRowsOnPage:function(){
		var _this=this;
		var idPath = _this.get('idPath');
		this.get('content').forEach(function(row) {
			row = Ember.Object.create(row)
			_this.get('selectedRows')[row.get(idPath)] =1;
		});
		this.notifyPropertyChange('selectedRows');
	},
	clearAllSelectedRows:function() {
		this.set('selectedRows',{});
		this.notifyPropertyChange('selectedRows');
	},
	_setData:function(response) {
		this.set('start',response.start);
		this.set('pageSize',response.pageSize);
		this.set('totalResults',response.totalResults);
		if(!objExists(this.get('focusSelectionId'))) {
			if(objExists(response.results[0])) {
				this.set('focusSelectionId',response.results[0].id);
			}
		}
		this.set('content',response.results);
	},
	init:function() {
		this._super();
		if(!objExists(this.get('service'))) {
			throw "De3.DataTableController: Service is not defined";
		}
		De3.setDefaultProperty(this,'loadingErrorMessage',"Sorry, something has gone wrong.");
		De3.setDefaultProperty(this,'idPath',"id");
		De3.setDefaultProperty(this,'headers',{});
		De3.setDefaultProperty(this,'selectedRows',{});
		De3.setDefaultProperty(this,'requestMethod','post');
		De3.setDefaultProperty(this,'dataFilter',De3.DataFilter.create());
		De3.setDefaultProperty(this,'content',Ember.A());
	}
});



De3.De1GrabberScansController = De3.DataTableController.extend({
	service: 'rest/GrabberApi/getAllScans',
	viewContainerSelector: 'section.resultsViewBody',
	search: function() {
		var grabberJob = this.get('grabberJob');
		var grabberScans = this.get('grabberJob.grabberScans');
		if(!objExists(grabberScans)) {
			this.set('grabberJob.grabberScans',Ember.A());
			grabberScans = this.get('grabberJob.grabberScans');
		}
		this.set('loading',true);
		if (objExists(grabberJob) &&
				objExists(grabberJob.get('sourceMachine')) &&
				objExists(grabberJob.get('sourceUser')) &&
				objExists(grabberJob.get('sourcePassword'))) {
			var _this = this;
			$.ajax({
				type: 'post',
				contentType: 'application/json',
				url: this.get('service'),
				data: JSON.stringify(grabberJob)
			}).success(function(data) {
				var scans = Ember.A();
				data.results.forEach(function(scan) {
					var grabberScan = De3.GrabberScan.create({
						name: scan.name,
						de1ScanId: scan.deScanId,
						id: "" + scan.deScanId
					});
					grabberScans.forEach(function(selectedGrabberScan) {
						if (selectedGrabberScan.de1ScanId == grabberScan.de1ScanId) {
							_this.get('selectedRows')["" + grabberScan.de1ScanId] = 1;
						}
					});
					
					scans.pushObject(grabberScan);
				});
				_this.set('content', scans);
				_this.notifyPropertyChange('selectedRows');
			}).error(function(response){
				new Notification().error(response.responseText);
			}).complete(function(){
				_this.set('loading',false);
			});
		}
	},
});

