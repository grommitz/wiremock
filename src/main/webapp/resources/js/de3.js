/**
 * a struct for holding selection states
 * @returns {ActionResultsRequest}
 */
function ActionResultsRequest() {
	this.rejectedIds = [];
	this.unsureIds = [];
	this.acceptedIds = [];
	this.selectedIds = [];
}
/**
 *  IconButton
 *  This class provides standard functions for action buttons in de3
 * @param {type} selector - jquery selector for button element
 * @param {type} hidden - not yet used but holds hidden state
 * @param {type} action - onclick event
 * @returns {IconButton}
 * 
 */
function IconButton(selector,hidden,action) {
	this.$el=$(selector);
	if(hidden===undefined) {
		hidden=false;
	}
	this.hidden=hidden;
	this.init();
	this.action = action;
	this.button=null;
}

IconButton.prototype = {
	init: function() {
		var _this=this;
		this.$el.off('click').off('touchstart').off('touchend').off('fastClick');
		$(this.$el).fastClick(function() {
			_this.action(this);
		});
	},
	hide: function(delay) {
		this.hidden=true;
		if(delay===undefined || delay===null) {
			delay=0;
		}
		var _this=this;
		setTimeout(function() {
			_this.$el.addClass('hiddenButton').attr('disabled',true);
		},delay);	
	},
	show: function(delay) {
		this.hidden=false;
		if(delay===undefined || delay===null) {
			delay=0;
		}
		var _this=this;
		setTimeout(function() {
			_this.$el.removeClass('hiddenButton').removeAttr('disabled');
		},delay);	
	},
	disable: function() {
		this.$el.attr('disabled',true);
	},
	enable: function() {
		this.$el.removeAttr('disabled');
	}
}

/**
 * IconButtonSet
 * A grouped collection of buttons, useful for keeping buttons in context
 */
function IconButtonSet(selector,hidden) {
	this.$el = $(selector);
	this.namespace = this.$el.attr('data-namespace');
	this.timeoutIncrement=150;
	if(hidden===true) {
		this.$el.hide();
	} else {
		this.show();
	}
}

IconButtonSet.prototype = {
	show: function(callbackFn) {
		var timeout=0;
		this.$el.show();
		var _this=this;
		this.$el.find('button').each(function() {
			var $el = this;
			setTimeout(function() {
				var name="";
				if(objExists(_this.namespace)) {
					name +=_this.namespace+"."
				}
				name += $($el).attr('id');
				window[name].show();
			},timeout);
			timeout+=_this.timeoutIncrement;
		});
		if(callbackFn!==undefined) {
			setTimeout(function() {
				callbackFn();
			},timeout+200);
		}
	},
	hide: function(callbackFn) {
		var timeout=0;
		var _this=this;
		this.$el.find('button').reverse().each(function() {
			var $el = this;
			setTimeout(function() {
				var name="";
				if(objExists(_this.namespace)) {
					name +=_this.namespace+"."
				}
				name += $($el).attr('id')
				window[name].hide();
			},timeout);
			timeout+=_this.timeoutIncrement;
		});
		setTimeout(function() {
			_this.$el.hide();
			if(callbackFn!==undefined) {
				callbackFn();
			}
		},timeout+200);
	}
}

/**
 * Probably not necessary but should help GC run more effectively.  Marks an object
 * for deletion from memory.
 * @param {type} obj
 * @returns {undefined}
 */
function deleteObj(obj) {
	if(objExists(obj)) {
		delete obj;
	}
}

/**
 * An interface for creating simple crud services
 * @param {String} serviceUrl - rest url endpoint
 * @param {String} containerSelector - jquery selector for serialisation container
 * @returns {CrudService}
 */
function CrudService(serviceUrl,containerSelector,templateSelector,serviceUrlForSave) {
	this.$el=$(containerSelector);
	this.serviceUrl=serviceUrl;
	if(objExists(serviceUrlForSave)) {
		this.serviceUrlForSave=serviceUrlForSave;
	} else {
		this.serviceUrlForSave=serviceUrl;
	}
	this.containerSelector = containerSelector;
	this.httpVerb="get";
	if(objExists(templateSelector)) {
		this.template = Handlebars.compile($(templateSelector).html());
	}
	this.data={};
}

CrudService.prototype = {
	MSG_DELETE_FAILED: "Sorry delete was unsuccessful.",
	load:function(entityId,callbackFn) {
		var _this = this;
		this.$el=$(this.containerSelector);
		if(objExists(entityId)) {
			$.ajax({
				url:'rest/'+_this.serviceUrl+'/'+entityId,
				type:'get',
				dataType:'json',
				complete: function(data) {
					_this.data=JSON.parse(data.responseText);
					_this.postProcessData(_this.data);
					_this._render(_this.data,callbackFn);
				}
			});	
		} else {
			_this.data = {};
			_this._render({},callbackFn);
		}
	},
	_render:function(data,callbackFn) {
		this.$el.html(this.template(data));
		this.$el.find('input[type="checkbox"][data-checked="true"]').attr('checked', true);
		this.$el.find('option[data-selected="true"]').attr('selected', 'selected');
		this.onLoad();
		if(objExists(callbackFn)) {
			callbackFn();
		}
	},
	addNew: function() {
		alert('Not Implemented');
	},
	edit: function() {
		alert('Not Implemented');
	},
	remove: function(id) {
		var _this=this;
		return $.ajax({
			url: 'rest/'+this.serviceUrl+'/'+id,
			contentType:'application/json',
			type:'delete',
			error: function(data) {
				if(data.status===500) {
					$.jGrowl(_this.MSG_DELETE_FAILED,{
						life: 10000,
						header:"An Error Occured",
						easing:"swing",
						theme:"jgrowl-ERROR"});
				}
			}
		});
	},
	save: function(callbackFn) {
		var data=this.serialise();
		this.onBeforeSave(data);
		var _this = this;
		var url = 'rest/'+this.serviceUrl;
		if(objExists(data.id)) {
			url+='/'+data.id;
		}
		if(this.serviceUrl!=this.serviceUrlForSave) {
			url+='/'+this.serviceUrlForSave;
		}
		$.ajax({
			url: url,
			data:JSON.stringify(data),
			contentType:'application/json',
			type:'put',
			success: function(data) {
				if(callbackFn!==undefined) {
					callbackFn(data);
				}
				_this.onSave(data);
				return data;
			},
			error: function(data) {
				if(data.status==500) {
					var errorMessage='Sorry save was unsuccessful. ';
					if(objExists(data.responseText)) {
						errorMessage+=data.responseText;
					}
					new Notification().error(errorMessage);
					return;
				} else if(data.status==412) {
					var errorMessage='';
					if(objExists(data.responseText)) {
						errorMessage+=data.responseText;
					}
					new Notification().info(errorMessage,'Sorry');
					return;
				} else if(data.status==403) {
					window.location.reload();
				}
				
				var response={};
				if(objExists(data.responseText)) {
					response = JSON.parse(data.responseText);
					_this.validate(response);
				}
			}
		});
	},
	validate: function(data) {
		var $el = $(this.containerSelector);
		$el.find('input').removeClass("ui-state-error").attr('title','');
		$el.find('textarea').removeClass("ui-state-error").attr('title','');
		$el.find('.messages').html('');
		var $generalErrorMessages = $el.find('div.generalError.messages');
		if($generalErrorMessages.length===0) {
			$generalErrorMessages = $el.find('[data-property]').first();
		}
		for(var i=0; i<data.length; i++) {
			if(data[i].propertyPath==="") {
				$generalErrorMessages.html(makeGeneralValidationMessage(data[i]));
			} else{
				var $inputElement = $el.find('[data-property="'+data[i].propertyPath+'"]');
				if($inputElement.length===0) {
					$generalErrorMessages.addClass("ui-state-error").attr('title',makeGeneralValidationMessage(data[i]))
							.qtip();
				}
				$inputElement.addClass("ui-state-error").attr('title',data[i].message)
							.qtip();
			}
		}
	},
	onBeforeSave: function(data) {},
	serialise: function() {
		var obj = $(this.containerSelector);
		var data = obj.toObject();
		return data;
	},
	postProcessData: function(){},
	onLoad: function(){},
	onSave: function(){}
}

/**
 * ModalWindow
 */
function createModalWindow(elementId,url,crudService) {   
	ModalWindow.prototype = crudService;
	ModalWindow.prototype.onLoad = function(entityId) {
		if(this.$modalwindow.css('display')=="none") {
			this.show();
		}	
	}
	ModalWindow.prototype.close = function() {
		this.$modalwindow.show();
		var _this = this;
		_this.$modalwindow.find('.windowPanel').addClass('hiddenSharePanel');
		$('#maskShade').removeClass('maskShadeActive');
		setTimeout(function() {
			_this.$modalwindow.hide();
			$('#maskShade').css('height','0%').css('width','0%');
			_this.onClose();
		},1000);
	}
	ModalWindow.prototype.show= function() {
		this.$modalwindow.show();
		var _this = this;
		setTimeout(function() {
			_this.$modalwindow.find('.windowPanel').removeClass('hiddenSharePanel');
			$('#maskShade').addClass('maskShadeActive');
			$('#maskShade').show();
			$('#maskShade').css('height','100%').css('width','100%');
			_this.onLoad();
			_this.onShow();
		},10);
	}
	ModalWindow.prototype.onShow= function(){}
	ModalWindow.prototype.onClose= function(){}
	ModalWindow.prototype.onSave= function(){
		this.close();
	}
    return new ModalWindow(elementId,url);
}
function ModalWindow(elementId,url) {
	this.$modalwindow=$('#'+elementId);
	this.$modalwindow.hide();
	this.url=url;
	this.httpVerb="get";
	this.sourceElementSelector = '#'+elementId+'_template';
	this.templateContent = $(this.sourceElementSelector).html();
	this.template = Handlebars.compile(this.templateContent);
	this.data={};
}



function makeGeneralValidationMessage(data) {
	if(!objExists(data.propertyPath)) {
		return data.message;
	}
	return data.propertyPath+": "+data.message;
}

function objExists(obj) {
	return obj!==undefined && obj !==null && obj!=="" && obj!=0;
}

function SelectedRow(id,type) {
	this.id=id;
	this.type=type;
}

function getCalendarRanges() {
	return [{name:"Day",type:"CURRENT_DAY"},{name:"Week",type:"CURRENT_WEEK"},{name:"Month",type:"CURRENT_MONTH"}];
}

Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {

    var operators, result;
    
    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }
    
    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }
    
    operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '!==': function (l, r) { return l !== r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
    };
    
    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }
    
    result = operators[operator](lvalue, rvalue);
    
    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});
	Handlebars.registerHelper('checked', function(option, value) {
        if (option == value) {
            return new Handlebars.SafeString('\" checked="checked');
        } else {
            return '\"';
        }
    });
    Handlebars.registerHelper('selected', function(option, value) {
        if (option == value) {
            return true;
        } else {
            return false;
        }
    });
    Handlebars.registerHelper('attrDisabled', function(disabled) {
        return new Handlebars.SafeString((disabled) ? 'disabled="disabled"' : '');
    });
    
var sortProperties = ["NONE","ASCENDING","DESCENDING"];
function RestDataTable(id,serviceUrl,options) {
	this.$datatable = $('#'+id);
	this.id=id;
	var $extraTemplate = this.$datatable.siblings('span.customTemplates').find('script').not('[data-partial]');
	var $editTemplate = this.$datatable.siblings('span.editTemplate').find('script');
	if($extraTemplate.length>0) {
		this.bodyTemplate=Handlebars.compile( $extraTemplate.html());
		this.$datatable.siblings('span.customTemplates').find('script[data-partial]').each(function() {
			 Handlebars.registerPartial($(this).attr('data-partial'), $(this).html());
		});
	} else {
		this.bodyTemplate=Handlebars.compile( $('#'+id+'_bodyTemplate').html());
	}
	if($editTemplate.length>0) {
		this.editTemplate = Handlebars.compile($editTemplate.html());
	}
	this.headerTemplate=Handlebars.compile( $('#'+id+'_headerTemplate').html());
	this.baseTemplate=Handlebars.compile( $('#'+id+'_baseTemplate').html());
	
	this.serviceUrl=serviceUrl;
	this.columns=[];
	this.data={};
	this.data.start=0;
	this.data.pageSize=0;
	this.data.totalResuls=0;
	this.searchRequest={};
	this.searchText="";
	if(options.selectable===undefined || options.selectable===null) {
		this.selectable='';
	} else {
		this.selectable=options.selectable;
	}
	if(options.rowsPerPage===undefined 
		|| options.rowsPerPage===null 
		|| options.rowsPerPage==='' 
		|| options.rowsPerPage===0) {
		this.rowsPerPage=100;
	} else {
		this.rowsPerPage=options.rowsPerPage;
	}
	this.fullHeight=options.fullHeight;
	this.showHeader=options.showHeader;
	this.showFooter=options.showFooter;
	//defaults
	this.sort={};
};

RestDataTable.prototype = {
	init: function(callbackFn,columns) {
		if(objExists(columns)) {
			this.columns=columns;
		}
		this.renderBase();
		this.renderHeader();
		this.search(callbackFn);
	},
	search:function(callbackFn) {
		/* get some values from elements on the page: */
		var searchRequest = this.getSearchRequest();
		var _this = this;
		/* Send the data using post and put the results in a div */
		$.get( 'rest/'+this.serviceUrl, searchRequest, 
		function( data ) {
			_this.data = _this.preprocess(data);
			_this.renderBody(data);
			_this.renderFooter(data);
			_this.onSearch();
			if(callbackFn!==undefined) {
				callbackFn();
			}
		});
	},
	renderBase : function() {
		var content = this.baseTemplate();
		this.$datatable.html(content);
	},
	renderHeader : function() {
		var _this= this;
		if(this.showHeader===true && objExists(this.columns)) {
			var content = _this.headerTemplate(this.columns);
			_this.$datatable.find('header').html(content).addClass('ui-widget-header');
		}
	},
	renderBody :function(data) {
		var content = this.bodyTemplate(data);
		this.$datatable.find('tbody').html(content);
		this.initClickHandlers();
	},
	renderFooter :function() {
		if(this.showFooter===true) {
			var pageIndex = this.data.start+this.rowsPerPage;
			if(pageIndex>this.data.totalResults) {
				pageIndex=this.data.totalResults;
			}
			var footerText;
			if(this.data.totalResults>0) {
				footerText="Viewing records ";
				footerText+=this.data.start+1;
				footerText+=" to ";
				footerText+=pageIndex;
				footerText+=" of ";
				footerText+=this.data.totalResults;
			} else {
				footerText="Sorry, no results found.";
			}
			if(this.$datatable.find('footer').length>0) {
				this.$datatable.find('footer').html('<span style="padding:2px;">'+footerText+'<span>');
			} else {
				this.$datatable.find('div.table').append('<footer><span style="padding:2px;">'+footerText+'<span></footer>');
			}
			
		}
	},
	adjustHeight: function(offset) {
		var _this=this;
		if(offset===undefined) {
			offset=40;
		}
		var $rowBody = this.$datatable.find('div.tableContainer');
		var top = 0;
		if (objExists($rowBody.offset())) {
			top = $rowBody.offset().top;
		}
		if(document.width<1260) {
			$rowBody.css('height',300);
		} else {
			$rowBody.css('height',document.documentElement.offsetHeight-top-offset);
		}
	},
	addSelectedIdToSessionStorage:function(resultId,type) {
		if (type===undefined) type=1;
		return sessionStorage.setItem(this.selectionStorageKey(resultId), JSON.stringify(new SelectedRow(resultId, type)));
	},
	setFocusedIdInSessionStorage:function(resultId) {
		return sessionStorage.setItem(this.focusStorageKey(), resultId);
	},
	preprocess:function(data) {
		for(var i=0; i<data.results.length; i++) {
			var row = data.results[i];
			if(row.id==sessionStorage[this.focusStorageKey()]) {
				row.focus=1;
			}
			var selectedRow = sessionStorage[this.selectionStorageKey(row.id)];
			if(objExists(selectedRow)) {
				selectedRow = JSON.parse(selectedRow);
				row.selected=selectedRow.type;
			}
			
		}
		return data;
	},
	selectRow:function(el) {
		if(this.$datatable.attr('data-focus')!==true) {
			$('div.richdatatable').attr('data-focus',false); 
			this.$datatable.attr('data-focus',true);
		}
		if(this.selectable==="single") {
			this.toggleSelectRow(el,1,true);
		} else if(this.selectable==="multi") {
			this.toggleSelectRow(el,1,false);
		} else if(this.selectable==="focus") {
			this.selectFocus($(el));
		}
	},
	initClickHandlers:function(){
		var _this=this;
		this.$datatable.find('.row').each(function() {
			$(this).off('click').fastClick(function(e) {
				e.stopPropagation();
				e.preventDefault();
				_this.selectRow(this);
				return false;
			});
		});
		this.initCustomActions();
	},
	selectFirstRow : function() {
		var firstRow = this.$datatable.find('.row').first();
		if(firstRow.length>0) {
			this.selectRow(firstRow);
			return firstRow;
		}
		return null;
	},
	selectFocus : function($element) {
		var $table = $element.parent();
		$table.children().not($element).attr('data-focus',0);
		$element.attr('data-focus',1);
		var selection = $element.attr('data-rowId');
		if (objExists(selection)) {
			sessionStorage.setItem(this.focusStorageKey(), selection);
		}
		this.onFocus($element);
	},
	toggleSelectRowForDelete:function(el) {
		this.toggleSelectRow(el,4,false,true);
	},
	toggleSelectRow:function(el,type,exclusive,noFocus) {
		var $element=$(el).closest('[data-rowId]');
		var $table = $element.parent();
		var resultId=$element.attr('data-rowId');
		var keyType = "selection_"+this.id;
		var keyName = this.selectionStorageKey(resultId);
		if(exclusive===true) {
			$table.children("[data-selected="+type+"]").not(el).attr('data-selected',0);
			var keysToRemove = new Array();
			for (var i = 0, len = sessionStorage.length; i  <  len; i++) {
				var keyValue = sessionStorage.key(i);
				if(objExists(keyValue)) {
					if(keyValue.indexOf(keyType)>=0) {
						if(JSON.parse(sessionStorage.getItem(keyValue)).type==type) {
							keysToRemove.push(keyValue);
						}
					}
				}
			}
			for (var j = 0; j < keysToRemove.length; j++) {
				sessionStorage.removeItem(keysToRemove[j]);
			}
		}
		if(this.isSelected(el,type)) {
			$element.attr('data-selected',0);
			sessionStorage.removeItem(keyName);
		} else {
					$element.attr('data-selected',type);
			var selection = $element.attr('data-rowid');
			if (objExists(selection)) {
				sessionStorage.setItem(keyName,JSON.stringify(new SelectedRow(selection, type)));
			}
		}
		if(!objExists(noFocus)) {
			this.selectFocus($element);
		} 
		
	},
	isSelected: function(el, type) {
		var $element=$(el).closest('[data-rowId]');
		if($element.attr('data-selected')==type) {
			return true;
		}
		return false;
	},
	editRow: function(id) { 
		var _this = this;
		this.crudService.containerSelector = '#'+this.id+' tr[data-rowid="'+id+'"]';
		this.crudService.load(id, function() {
			_this.initCustomActions();
		});
	},
	saveRow: function() {
		var _this = this;
		this.crudService.save(function() {
			_this.search();
			if(defaultButtons!==undefined) {
				defaultButtons.show();
			}
		});
	},
	cancelEditRow: function() {
		this.search();
		if(defaultButtons!==undefined) {
			defaultButtons.show();
		}
	},
	registerKeyboardActionsOn: function(element) {
		var _this = this;
		element.focus().keyup(function() {
			if(event.which=='13') {
				_this.saveRow();
			} else if(event.which=='27') {
				_this.cancelEditRow();
			}
		});
	},
	clearSelection: function(id) {
		sessionStorage.removeItem(this.selectionStorageKey(id));
	},
	clearFocus: function(id) {
		sessionStorage.removeItem(this.focusStorageKey(id));
	},
	clearSelections: function(type) {
		var _this = this;
		var keysToClear = [];
		this.iterateOverSelections(type,function(selectedRow) {
			var keyName=_this.selectionStorageKey(selectedRow.id);
			keysToClear.push(keyName);
		});
		for(var i=0; i<keysToClear.length; i++) {
			sessionStorage.removeItem(keysToClear[i]);
		}
	},
	selectionStorageKey: function(resultId) {
			return "selection_"+this.id+"."+resultId;
	},
	focusStorageKey: function() {
		return "focus_"+this.id;
	},
	hasSelections: function(type) {
		var keyType = "selection_"+this.id;
		for (var i=0, len = sessionStorage.length; i  <  len; i++){
			var key = sessionStorage.key(i);
			if(objExists(key) && key.indexOf(keyType)>=0) {
				if(JSON.parse(sessionStorage.getItem(key)).type==type){
					return true;
				}
			}
		} 
		return false;
	},
	getSelections: function(type) {
		var selections = [];
		this.iterateOverSelections(type,function(selectedRow) {
			selections.push(selectedRow);
		});
		return selections;
	},
	iterateOverSelections: function(type,fn) {
		var keyType = "selection_"+this.id;
		for (var i=0, len = sessionStorage.length; i  <  len; i++){
			var key = sessionStorage.key(i);
			if(objExists(key) && key.indexOf(keyType)>=0) {
				var selectedRow = JSON.parse(sessionStorage.getItem(key));
				if(objExists(type)) {
					if(selectedRow.type==type) {
						fn(selectedRow);
					}
				} else {
					fn(selectedRow);
				}
			}
		}
	},
	getSearchRequest: function() {
		var formParams = "query="+this.searchText;
		formParams+="&start="+this.data.start;
		formParams+="&pageSize="+this.rowsPerPage;
		formParams+="&sort="+JSON.stringify(this.getSort());
		formParams=this.serialiseExtra(formParams);
		return formParams;
	},
	getFocusedRowId: function() {
		return sessionStorage[this.focusStorageKey()];
	},
	weAreOnTheFirstPage: function() {
		return this.data.start==0;
	},
	weAreOnTheLastPage : function() {
		return this.data.start+this.rowsPerPage>=this.data.totalResults;
	},
	previousPage:function() {
		if(this.data.start===0) return;
		var newValue = this.data.start-this.rowsPerPage;
		if(newValue<0) {
			newValue=0;
		} 
		this.data.start=newValue;
		this.search();
	},
	nextPage: function() { 
		var newStartValue = this.data.start+this.rowsPerPage;
		if(newStartValue<this.data.totalResults) {
			this.data.start=newStartValue;
			this.search();
		}
	},
	firstPage: function() { 
		this.data.start=0;
		this.search();
	},
	lastPage: function() {
		var remainder = this.data.totalResults%this.rowsPerPage;
		if(remainder>0) {
			this.data.start=this.data.totalResults-remainder;
		} else {
			this.data.start=this.data.totalResults-this.rowsPerPage;
		}
		this.search();
	},
	getSort : function() {
		var sortParams = [];
		this.$datatable.find('header > div').each(function (){
			var sortParam = {};
			sortParam.order = $(this).attr('data-sort');
			sortParam.title = $(this).attr('data-title');
			if ($.inArray(sortParam.order, sortProperties)>0) {
				sortParams.push(sortParam);
			}
		});
		return sortParams;
	},
	getColumnValue :function(el) {
		var value = data.results[rowNum].data[columnNum];
		if (value!==null) {
			return value;
		}
		return "";
	},
	toggleSort : function(selectedHeader) {
		var $element = $(selectedHeader);
		var sort = $element.attr("data-sort");
		$element.siblings().attr("data-sort","NONE");
		var sortIndex = $.inArray(sort,sortProperties);
		sortIndex++;
		if(sortIndex>=sortProperties.length) {
			sortIndex=0;
		}
		$element.attr("data-sort",sortProperties[sortIndex]);
		this.search();
	},
	onFocus : function($row) {},
	serialiseExtra: function(formParams) {
		return formParams;
	},
	initCustomActions: function(){},
	onSearch: function(){}
}; 


