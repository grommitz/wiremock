/**************************
* Application
**************************/
var DeC = Ember.Application.create();
var De3 = Ember.Namespace.create();
var Env = Ember.Namespace.create();
var JQ = Ember.Namespace.create();

$.extend({
    keys:    function(obj){
        var a = [];
        $.each(obj, function(k){ a.push(k) });
        return a;
    }
});

/**************************
* Models
**************************/
De3.Tag = Ember.Object.extend({
	id:null,
	name:null
});

De3.DeCentralSettings = Ember.Object.extend({
	id:null,
	host:null,
	enabled:null,
	priority:null,
	httpPort:null,
	httpsPort:null,
	useHttps:null,
	path:null
});

De3.TagGroup = Ember.Object.extend({
	name:null,
	id:null
});

De3.UserTag = Ember.Object.extend({
	id:null,
	tag:null,
	parent:null,
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'tag',De3.Tag.create());
		De3.setDefaultProperty(this,'parent',De3.TagGroup.create());
	}
});

De3.Scan = Ember.Object.extend({
	id:null,
	name:null,
	deScanId:null
});
De3.WebResultField = Ember.Object.extend({
	id:null,
	displayName:null,
	pathFromWebResult:null,
	methodForSettingValues:null,
	init: function() {
		this._super();
		this.set("methodForSettingValues", 'REFLECTION');
	}
});

De3.FeatureDefinition = Ember.Object.extend({
	id: '',
	name: '',
	webResultField: null,
	init: function() {
		this._super();
		De3.setDefaultProperty(this, 'webResultField', De3.WebResultField.create());
	}
});
			
De3.ClientAsset = Ember.Object.extend({
	id:null,
	name:null
});

De3.SavedView = Ember.Object.extend({
	id:null,
	name:null
});
De3.UserGroup = Ember.Object.extend({
	id:null,
	groupName:null,
	groupType:null,
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'id',0);
		this.set('groupType','SYSTEMGROUP');
	}
});
De3.ClientAccountSettings = Ember.Object.extend({
	ssoEnabled:null,
	passwordExpiry:null,
	clientEnabled:null,
	newClientNotificationSent:null,
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'ssoEnabled',false);
		De3.setDefaultProperty(this,'passwordExpiry',0);
		De3.setDefaultProperty(this,'clientEnabled',false);
		De3.setDefaultProperty(this,'newClientNotificationSent',false);
	}
});
De3.Client = De3.UserGroup.extend({
	clientAccountSettings:null,
	init: function() {
		this._super();
		this.set('groupType','CLIENTGROUP');
		De3.setDefaultProperty(this,'clientAccountSettings',De3.ClientAccountSettings.create());
	}
});

De3.UserSettings = Ember.Object.extend({
	email:null
});
De3.UserAccountSettingsSpec = Ember.Object.extend({
	userName:null,
	password:null,
	textPassword:null,
	emailAddress:null
});
De3.UserLogin = Ember.Object.extend({
	userName:null,
	password:null,
	textPassword:null,
	userSettings:null,
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'userSettings',De3.UserSettings.create());
	}
});

De3.GrabberScan = Ember.Object.extend({
	id:null,
	de1ScanId:null
});

De3.GrabberSettings = Ember.Object.extend({
	id:null,
	batchSize:null,
	checkNewResultsPeriodMinutes:null,
	retryAfterErrorPeriodMinutes:null,
	scanUpdateIntervalMinutes:null,
	deleteResultsMarkedDeleted:null
});

De3.GrabberJob = Ember.Object.extend({
	sourceMachine:null,
	sourceUser:null,
	sourcePassword:null,
	moveResults:null,
	moveDocCache:null,
	basicAuthUser:null,
	basicAuthPassword:null,
	grabberScans:null,
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'grabberScans',[]);
		De3.setDefaultProperty(this,'moveResults',true);
		De3.setDefaultProperty(this,'moveDocCache',true);
	}
});

De3.SearchSourceParameter = Ember.Object.extend({
	id: null,
	name: null,
	value: null
});

De3.SearchSource = Ember.Object.extend({
	id: null,
	pageStart: null,
	pageSize: null,
	maxPages: null,
	xpath: null,
	regex: null,
	searchSourceParameters: null,
	rule: null,
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'searchSourceParameters',[]);
		De3.setDefaultProperty(this,'pageStart',0);
		De3.setDefaultProperty(this,'pageSize',1);
		De3.setDefaultProperty(this,'maxPages',1);
		De3.setDefaultProperty(this,'rule',De3.RuleId.create());
	}
});

De3.RemoteDe2Credentials =  Ember.Object.extend({
	username:null,
	password:null,
});

De3.RemoteDe2ConnectionInfo =  Ember.Object.extend({
	credentials:null,
	host:null,
	useHttps:null,
	port:null,
	init: function() {
		this._super();
		De3.setDefaultProperty(this, 'credentials', De3.RemoteDe2Credentials.create());
		De3.setDefaultProperty(this, 'useHttps', false);
		De3.setDefaultProperty(this, 'port', 8081);
	}
});

De3.SavedSearchImport = Ember.Object.extend({
	connectionInfo:null,
	savedSearches:null,
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'savedSearches',[]);
		De3.setDefaultProperty(this,'connectionInfo', De3.RemoteDe2ConnectionInfo.create());
	}
});

De3.NewClientSpec = Ember.Object.extend({
	client:null,
	assets:null,
	scans:null,
	users:null,
	savedSearchImport:null,
	grabbers:null,
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'client',De3.Client.create());
		De3.setDefaultProperty(this,'assets',[]);
		De3.setDefaultProperty(this,'scans',[]);
		De3.setDefaultProperty(this,'users',[]);
		De3.setDefaultProperty(this,'grabbers',[]);
		De3.setDefaultProperty(this,'savedSearchImport', De3.SavedSearchImport.create());
	}
});
De3.Whois = Ember.Object.extend({
	id:null,
	registrar:null,
	status:null
});
De3.Domain = Ember.Object.extend({
	id:null,
	name:null,
	whois:null,
	init:function(){
		this._super();
		if(objExists(this.get('whois'))) {
			this.set('whois',De3.Whois.create(this.get('whois')));
		} else {
			this.set('whois',De3.Whois.create());
		}
	}
});
/**************************
* Mixins
**************************/
Ember.TextField.reopen({
	attributeBindings:['dataProperty:data-property'],
	dataProperty:function() {
		if(objExists(this.get('parentView.propertyName'))) {
			return this.get('parentView.propertyName');
		}
		var binding = this.get('parentView.valueBinding._from');
		if (!objExists(binding)) {
			binding = this.get('valueBinding._from');
		}
		if (!objExists(binding)) {
			return null;
		}
		binding=binding.replace("_parentView.context.","");
		if($.isArray(this.get('parentView.value'))){
			var properties = this.get('valueBinding._from').split('.');
			binding+="."+properties[properties.length-1];
		}
		return binding;
	}.property("propertyName")
});
Ember.View.reopen({
    attributeBindings: ['style'],
	resizeWindow:function(){},
    didInsertElement: function() {
        this._super();
		var _this=this;
        this.setIsRendered();
		$(window).resize(function(){
			if(_this.state!=="inDOM") {
				Ember.run.scheduleOnce('afterRender',function(){
					_this.resizeWindow();
				});
			} else {
				_this.resizeWindow();
			}
		});
		Ember.run.scheduleOnce('afterRender',function(){
			_this.resizeWindow();
		});
    },
     setIsRendered: function() {
        if (this.state==="inDOM") {
            this.set('isRendered', true);
        } else {
            Ember.run.next(this, function() {
                this.setIsRendered();
            });
        }
    }
});
Ember.Select.reopen({
    attributeBindings: ['required','style']
});
Env.UploadForm = Ember.View.extend({
	templateName:'uploadForm_template',
	fileChosen:function() {
		var imgAreaElt = $('.imgAreaSelect');
		if (imgAreaElt.length > 0) {
			imgAreaElt.imgAreaSelect({remove:true});
		}
		this.set('parentView.status',1);
	},
	saveButtonLabel:'Upload',
	serviceUrl:function() {
		return this.get('parentView.serviceUrl');
	}.property('parentView.serviceUrl'),
	didInsertElement:function() {
		var _this=this;
		var $el = this.$();
		var $form = $el.find('form');
		$form.ajaxForm({
			type:'post',
			beforeSend: function() {
				//Started Progress
				_this.get('parentView').set('status',2);
				_this.get('parentView').set('progress',0);
			},
			uploadProgress: function(event, position, total, percentComplete) {
				_this.get('parentView').set('progress',percentComplete);
			},
			complete: function(xhr) {
				if((xhr.status!==200 && xhr.status!==0) || xhr.responseText.indexOf('Exception')>0) {
					_this.get('parentView').set('status',4);
					_this.get('parentView').onUploadError();
				} else {
					_this.get('parentView').set('status',3);
					_this.get('parentView').onUploadSuccess();
				}
				Ember.run.scheduleOnce('afterRender',this,function(){
					_this.get('parentView').$().find('.uploadResult').append(xhr.responseText);
					_this.get('parentView').$().find('input[type="file"]').val('');
				});
			}
		});
	}
});
De3.UploadService = Em.Mixin.create({
	status:null,
	saveButtonLabel:'Upload',
	onUploadSuccess:function(){},
	onUploadError:function(){},
	showBack:function() {
		return !this.get('uploadInProgress');
	}.property('status'),
	showSave:function() {
		return this.get('uploadReady');
	}.property('status'),
	uploadFormView:Env.UploadForm.extend(),
	uploadWaiting:function() {
		return this.get('status')===null;
	}.property('status'),
	uploadReady:function() {
		return this.get('status')===1;
	}.property('status'),
	uploadInProgress:function() {
		return this.get('status')===2;
	}.property('status'),
	uploadComplete:function() {
		return this.get('status')===3;
	}.property('status'),
	uploadError:function() {
		return this.get('status')===4;
	}.property('status'),
	progress:null,
	response:null,
	upload: function() {
		this.$().find('form').submit();	
	}
});

De3.CrudService = Em.Mixin.create({
	MSG_DELETE_FAILED: "Sorry delete was unsuccessful.",
	saveInProgress: false,
	onSuccess:function() {},
	onBeforeSave:function() {return true;},
	onError:function() {},
	deleteById: function(id) {
		var _this=this;
		var url = this.get('service');
		return $.ajax({
			url: url+'/'+id,
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
	customPayload:null,
	save: function() {
		this.set("saveInProgress", true);
		Env.removeAllQtips();
		this.set('generalError',null);
		if(this.onBeforeSave()===false) {
			this.set("saveInProgress", false);
			return false;
		}
		var url = this.get('service');
		var payload;
		if (objExists(this.get('customPayload'))) {
			payload = this.get('customPayload')
		} else {
			payload = this.get('content');
		}
		var _this=this;
		if(objExists(payload.id)) {
			url+="/"+payload.id;
		}
		return $.ajax({
			url:url,
			type:'put',
			contentType:'application/json',
			data:JSON.stringify(payload)
		}).success(function(response) {
			_this.onSuccess(response);
			if(objExists(_this.hide)) {
				_this.hide();
			}
		}).error(function(response) {
			Env.handleAjaxError(response);
			_this.onError(response);
		}).complete(function() {
			_this.set("saveInProgress", false);
		});
	}
});

Env.selectFieldForValidationError = function(context,validationError) {
	var selectorQueryElement = '[data-property="'+validationError.propertyPath+'"]';
	if(objExists(validationError.key)) {
		var selectorQueryRow="tr[data-rowId=\""+validationError.key.id+"\"]";
		return context.$(selectorQueryRow).find(selectorQueryElement);
	}
	return $(selectorQueryElement);
}

$.fn.extend({
  safeClone: function() {
    var clone;
    clone = $(this).clone();
    clone.find('script[id^=metamorph]').remove();
    clone.removeClass('ember-view');
    clone.find('*').each(function() {
      var $this;
      $this = $(this);
      $this.removeClass('ember-view');
      return $.each($this[0].attributes, function(index, attr) {
        if (attr.name.indexOf('data-bindattr') === -1) {
          return;
        }
        return $this.removeAttr(attr.name);
      });
    });
    if (clone.attr('id') && clone.attr('id').indexOf('ember') !== -1) {
      clone.removeAttr('id');
    }
    
    clone.find('[id^=ember]').removeAttr('id');
    return clone;
  }
});
JQ.Widget = Em.Mixin.create({
  // When Ember creates the view's DOM element, it will call this
  // method.
  didInsertElement: function() {
    // Make jQuery UI options available as Ember properties
    var options = this._gatherOptions();

    // Make sure that jQuery UI events trigger methods on this view.
    this._gatherEvents(options);

    // Create a new instance of the jQuery UI widget based on its `uiType`
    // and the current element.
    var ui = jQuery.ui[this.get('uiType')](options, this.get('element'));

    // Save off the instance of the jQuery UI widget as the `ui` property
    // on this Ember view.
    this.set('ui', ui);
  },

  // When Ember tears down the view's DOM element, it will call
  // this method.
  willDestroyElement: function() {
    var ui = this.get('ui');

    if (ui) {
      // Tear down any observers that were created to make jQuery UI
      // options available as Ember properties.
      var observers = this._observers;
      for (var prop in observers) {
        if (observers.hasOwnProperty(prop)) {
          this.removeObserver(prop, observers[prop]);
        }
      }
      ui._destroy();
    }
  },

  // Each jQuery UI widget has a series of options that can be configured.
  // For instance, to disable a button, you call
  // `button.options('disabled', true)` in jQuery UI. To make this compatible
  // with Ember bindings, any time the Ember property for a
  // given jQuery UI option changes, we update the jQuery UI widget.
  _gatherOptions: function() {
    var uiOptions = this.get('uiOptions'), options = {};

    // The view can specify a list of jQuery UI options that should be treated
    // as Ember properties.
    uiOptions.forEach(function(key) {
      options[key] = this.get(key);

      // Set up an observer on the Ember property. When it changes,
      // call jQuery UI's `setOption` method to reflect the property onto
      // the jQuery UI widget.
      var observer = function() {
        var value = this.get(key);
        this.get('ui')._setOption(key, value);
      };

      this.addObserver(key, observer);

      // Insert the observer in a Hash so we can remove it later.
      this._observers = this._observers || {};
      this._observers[key] = observer;
    }, this);

    return options;
  },

  // Each jQuery UI widget has a number of custom events that they can
  // trigger. For instance, the progressbar widget triggers a `complete`
  // event when the progress bar finishes. Make these events behave like
  // normal Ember events. For instance, a subclass of JQ.ProgressBar
  // could implement the `complete` method to be notified when the jQuery
  // UI widget triggered the event.
  _gatherEvents: function(options) {
    var uiEvents = this.get('uiEvents') || [], self = this;

    uiEvents.forEach(function(event) {
      var callback = self[event];

      if (callback) {
        // You can register a handler for a jQuery UI event by passing
        // it in along with the creation options. Update the options hash
        // to include any event callbacks.
        options[event] = function(event, ui) { callback.call(self, event, ui); };
      }
    });
  }
});
/**************************
* Views
**************************/
Env.CalendarView = Ember.View.extend({
	template:Ember.Handlebars.compile('{{view.output}}'),
	tagName:'span',
	value:null,
	inputFormat:null,
	outputformat:null,
	content:null,
	output:function(){
		var content;
		if(this.get('inputFormat')){
			if(this.get('inputFormat')==="unix") {
				content=moment.unix(this.get('value'));
			} else {
				content=moment(this.get('value'),this.get('inputFormat'));
			}
		} else {
			content=moment(this.get('value'));
		}
		if(content===null) {
			return null;
		}
		this.set('content',content);
		if(objExists(this.get('outputFormat'))) {
			return content.format(this.get('outputFormat'));
		} else {
			return content.calendar();
		}
	}.property('value')
});
Ember.Handlebars.helper('calendar', Env.CalendarView);

De3.EditableField = Ember.View.extend({
	templateName:'EditableField',
	classNames:'editableField',
	style:"float:left; padding:2px;"
});
// Create a new Ember view for the jQuery UI Button widget
JQ.Button = Em.View.extend(JQ.Widget, {
  uiType: 'button',
  uiOptions: ['label', 'disabled'],

  tagName: 'button'
});

// Create a new Ember view for the jQuery UI Menu widget (new
// in jQuery UI 1.9). Because it wraps a collection, we extend from
// Ember's CollectionView rather than a normal view.
//
// This means that you should use `#collection` in your template to
// create this view.
JQ.Menu = Em.CollectionView.extend(JQ.Widget, {
  uiType: 'menu',
  uiOptions: ['disabled'],
  uiEvents: ['select'],

  tagName: 'ul',

  // Whenever the underlying Array for this `CollectionView` changes,
  // refresh the jQuery UI widget.
  arrayDidChange: function(content, start, removed, added) {
    this._super(content, start, removed, added);

    var ui = this.get('ui');
    if(ui) {
      // Schedule the refresh for after Ember has completed it's
      // render cycle
      Em.run.schedule('render', function(){
        ui.refresh();
      });
    }
  },
  itemViewClass: Em.View.extend({
    // Make it so that the default context for evaluating handlebars
    // bindings is the content of this child view. In a near-future
    // version of Ember, the leading underscore will be unnecessary.
    _context: function(){
      return this.get('content');
    }.property('content')
  })
});

// Create a new Ember view for the jQuery UI Progress Bar widget
JQ.ProgressBar = Em.View.extend(JQ.Widget, {
  uiType: 'progressbar',
  uiOptions: ['value', 'max'],
  uiEvents: ['change', 'complete']
});
DragNDrop = Ember.Namespace.create();

DragNDrop.cancel = function(event) {
    event.preventDefault();
    return false;
};

DragNDrop.Draggable = Ember.Mixin.create({
    attributeBindings: 'draggable',
    draggable: 'true',
    dragStart: function(event) {
        var dataTransfer = event.dataTransfer;
        dataTransfer.setData('Text', this.get('elementId'));
    }
});

DragNDrop.Droppable = Ember.Mixin.create({
    dragEnter: DragNDrop.cancel,
    dragOver: DragNDrop.cancel,
    drop: function(event) {
        event.preventDefault();
        return false;
    }
});

JQ.Draggable = Em.View.extend(JQ.Widget, {
	revert:true,
	revertDuration:0,
	uiType: 'draggable',
	uiOptions: ['delay', 'containment','handle','scope','revert','revertDuration','helper'],
	uiEvents: ['create', 'start','drag','stop'],
	zIndex: 999,
	helper:'clone',
	appendTo: "body" 
});

// Create a new Ember view for the jQuery UI Progress Bar widget
JQ.Droppable = Em.View.extend(JQ.Widget, {
  uiType: 'droppable',
  uiOptions: ['accept', 'activeClass','addClasses','hoverClass','tolerance'],
  uiEvents: ['create', 'activate','deactivate','over','out'],
  hoverClass:"ui-state-active",
  activeClass:"ui-state-hover",
  attributeBindings:['style'],
  style:null,
  tolerance:'intersect'
});

JQ.Droppable.reopen(Ember.TargetActionSupport,{
source:null,
drop:function(e) {
	this.set('source',e.originalEvent.target);
	this.triggerAction(e);
}
});


De3.ModalWindow = Ember.View.extend({
	layoutName:'modalwindow_template',
	classNames:['panel'],
	classNameBindings: ['active:activeSharePanel:hiddenSharePanel','flipMode:flip','largeScreen:roundCorners'],
	attributeBindings: ['style'],
	tagName:'section',
	flipSideView:null,
	flipMode:false,
	flipWindow:function(){
		if(objExists(this.get('flipSideView'))) {
			if(this.get('flipMode')===true){
				this.set('flipMode',false);
			} else {
				this.set('flipMode',true);
			}
		}
	},
	left:null,
	saveButtonLabel:null,
	closeButtonLabel:null,
	customFooterView:null,
	maskTimeout:null,
	contentHeight:null,
	generalError:null,
	largeScreen:false,
	_getContentHeight:function(){
		var _this=this;
		var height = this.get('height');
		var headerHeight=53;
		var footerHeight=33;
		if(this.state==="inDOM") {
			headerHeight = this.$().find('header').outerHeight();
			footerHeight = this.$().find('footer').outerHeight();
		}
		height=height-footerHeight-headerHeight;
		this.set('contentHeight',height);
		if(objExists(this.get('generalError'))) {
			height+=16;
		}
		var windowHeight = $(window).height();
		if(windowHeight<this.get('height')) {
			height=height-(this.get('height')-windowHeight);
			this.set('largeScreen',false);
		} else {
			this.set('largeScreen',true);
		}
		if(objExists(this.onResize)) {
			Ember.run.scheduleOnce('afterRender', this, function(){
				_this.onResize($(window).width(),windowHeight);
			});
		}
		return height;
	},
	contentStyle:function() {
		var height = this._getContentHeight();
		return "height:"+height+"px; width:100%;overflow-x:hidden;overflow-y:auto;padding-top: 8px;padding-bottom: 8px;";
	}.property('height','isRendered','generalError','windowHeight'),
	windowHeight:null,
	style:function() {
		var height = parseInt(this.get('height'));
		if(objExists(this.get('generalError'))) {
			height+=16;
		}
		return "z-index:15000;max-width:"+this.get('width')+"px;width:100%; max-height:"+height+"px; height:100%;left:"+this.get('left')+"px;";
	}.property('height','width','generalError','left'),
	title:null,
	active:false,
	onBeforeShow:function(){},
	onBeforeHide:function(){},
	onAfterHide:function(){this.remove();},
	show: function(obj) {
		if(!objExists(this.$())){
			this.append();
		}
		if(!objExists(obj)) {
			obj={};
		}
		this.set('content',obj);
		this.onBeforeShow();
		Ember.run.scheduleOnce('afterRender',this,function(){
			var _this = this;
			
			setTimeout(function() {
				_this.set('left',0);
				_this.set('active',true);
				//$('.blurMask').css('-webkit-filter','blur(2px)');
				$('#maskShade').show();
				$('#maskShade').addClass('maskShadeActive');
				if(objExists(_this.maskTimeout)) {
					clearTimeout(_this.maskTimeout);
				}
				$('#maskShade').css('height','100%').css('width','100%');
				$('body').find('.wizardPage').each(function() {
					Env.restrictTabKeyTo($(this));
				});
			},10);
		});
	},
	hide:function(swappingWithAnotherWindow) {
		var _this = this;
		_this.onBeforeHide();
		_this.set('active',false);
		if(swappingWithAnotherWindow!==true) {
			$('#maskShade').removeClass('maskShadeActive');
		}
		_this.maskTimeout = setTimeout(function() {
			if(swappingWithAnotherWindow!==true) {
				$('#maskShade').css('height','0%').css('width','0%');
				$('#maskShade').hide();
			}
			_this.set('left',-9999);
			_this.set('content',null);
			_this.onAfterHide();
		},1000);
		Env.removeAllQtips();
	},
	doSave:function() {
		if(this.get('saveInProgress')===false) {
			return this.save();
		}
	},
	showSave:function() {
		return this.get('showSaveValue');
	}.property('showSaveValue'),
	showSaveValue:null,
	save:function(){},
	didInsertElement:function() {
		this._super();
		var _this=this;
		var section = this.$().find('section.panel');
		section.css('left',"-9999");
		$(window).resize(function(){
			var windowHeight = $(window).height();
			_this.set('windowHeight',windowHeight);
		});
	},
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'left',-9999);
		De3.setDefaultProperty(this,'height',400);
		De3.setDefaultProperty(this,'width',500);
		De3.setDefaultProperty(this,'saveButtonLabel','Save');
		De3.setDefaultProperty(this,'closeButtonLabel','Close');
		De3.setDefaultProperty(this,'showSaveValue',true);
	},
	saving: function() {
		if(objExists(this.$())) {
			if(this.get('saveInProgress')===true) {
				this.$().mask("Saving...");
			} else {
				this.$().unmask();
			}
		}
	}.observes('saveInProgress')

});

De3.ModalWindowFlipSide = Ember.View.extend({
	classNames:['back sharePanel shadowBorderStrong roundCorners disableUserSelect'],
	attributeBindings: ['style'],
	layoutName:'modalwindowBackSide_template',
	tagName:'div',
	saveButtonLabel:null,
	style:function(){
		return "max-width:"+this.get('parentView.width')+'px;width:100%;';
	}.property('parentView.width'),
	backButtonLabel:'Back',
	title:null,
	active:false,
	doSave:function() {
		if(this.get('saveInProgress')===false) {
			this.save();
		}
	},
	back:function(){
		var _this=this;
		this.get('parentView').flipWindow();
		setTimeout(function(){_this.set('content',null)},500);
	},
	showSave:function() {
		return this.get('showSaveValue');
	}.property('showSaveValue'),
	showSaveValue:null,
	save:function(){},
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'showSaveValue',true);
	}
});



De3.ImageGallery = De3.ModalWindow.extend({
	layoutName:'imageGallery_template',
	doSave:function() {},
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'height','400px');
		De3.setDefaultProperty(this,'width','400px')
	}
});
De3.WizardView = Ember.View.extend(De3.CrudService,{
	tagName:'article',
	layoutName:'wizardView_template',
	classNameBindings:['front:frontWizardPage','back:backWizardPage','current:currentWizardPage'],
	classNames:['wizardPage'],
	front:null,
	current:null,
	back:null,
	title:null,
	serviceUrl:null,
	isValid:function(continueFn) {
		var _this=this;
		Env.removeAllQtips();
		var data = this.get('content');
		if(objExists(this.get('serviceUrl')) && objExists(data)) {
			if( objExists(data.get('firstObject')) ) {
				data=data.get('firstObject');	
			}
			$.ajax({ 
				url:this.get('serviceUrl')+'/validate',
				type:'put',
				contentType:'application/json',
				data:JSON.stringify(data)
			}).error(function(data){
				if(data.status===400) {
					var errorMessage = JSON.parse(data.responseText);
					errorMessage.forEach(function(error) {
						Env.errorQtip(_this.$().find('[data-property="'+error.propertyPath+'"]'),error.message);
					});
				}

			}).success(function() {
				continueFn();
			});
		} else {
			continueFn();
		}
	},
	didInsertElement:function() {
		var height = this.$().closest('section.content').css('height').split('px')[0];
		this.$().find('section.wizardContentsPanel').css('height',height-33-24);
	}
});



De3.Wizard = De3.ModalWindow.extend({
	templateName:'wizard_template',
	classNames:['shadowBorderStrong'],
	layoutName:'modalwindowWizard_template',
	pages:[],
	content:null,
	attributeBindings: ['style'],
	pageIndex:null,
	currentPage:function() {
		return this.get('pages')[this.get('pageIndex')];
	}.property('pageIndex'),
	onAfterHide:function() {
		this.set('pageIndex',0);
	},
	syncIndexes:function() {
		var i=0;
		var indexFound=false;
		var _this=this;
		this.get('pages').forEach(function(page) {
			if(_this.get('pageIndex')===i) {
				page.set('front',null);
				page.set('back',null);
				page.set('current',true);
				indexFound=true;
			} else if(indexFound) {
				page.set('front',true);
				page.set('back',null);
				page.set('current',null);
			} else {
				page.set('front',null);
				page.set('back',true);
				page.set('current',null);
			}
			i++;
		});
	}.observes('pageIndex'),
	didInsertElement:function() {
		this.syncIndexes();
		this._updateSelectedIndex();
	},
	back:function(){
		Env.removeAllQtips();
		var pageIndex = this.get('pageIndex');
		if(pageIndex>0) {
			this.set('pageIndex',--pageIndex);
		}
	},
	next:function(){
		var _this=this;
		this.get('currentPage').isValid(function() {
			Env.removeAllQtips();
			var pageIndex = _this.get('pageIndex');
			if(pageIndex<(_this.get('pages').length-1)) {
				_this.set('pageIndex',++pageIndex);
			}
		});
	},
	_updateSelectedIndex:function(){
		var _this=this;
		this.get('pages').forEach(function(page){
			if(Ember.isEqual(_this.get('currentPage.title'),page.get('title'))){
				page.set('selected',1);
			} else {
				page.set('selected',null);
			}
		});
	}.observes('pageIndex'),
	canDoBack:function() {
		var pageIndex = this.get('pageIndex');
		return pageIndex>0;
	}.property('pageIndex'),
	canDoNext:function() {
		var pageIndex = this.get('pageIndex');
		return pageIndex<(this.get('pages').length-1);
	}.property('pageIndex'),
	doSave:function() {},
	init: function() {
		this._super();
		this.set('pageIndex',0);
		this.set('pages',[]);
	}
});

De3.ExpandingTextField = Ember.View.extend({
    tagName: "span",
    contenteditable:"true",
    attributeBindings: ["contenteditable",'dataProperty:data-property'],
    keyup: function(){ 
        App.item.set('value',this.$().html())
    },
    paste: function(){ 
        App.item.set('value',this.$().html())
    },
    blur: function(){ 
        App.item.set('value',this.$().html())
    },
    didInsertElement:function(){
         App.item.set('value',this.$().html()) 
    },
	validationMessage:null,
	dataProperty:function() {
		if(objExists(this.get('propertyName'))) {
			return this.get('propertyName');
		}
		var binding = this.get('parentView.valuefunBinding._from');
		binding=binding.replace("_parentView.context.","");
		if($.isArray(this.get('parentView.value'))){
			var properties = this.get('valueBinding._from').split('.');
			binding+="."+properties[properties.length-1];
		}
		return binding;
	}.property()
});

De3.SearchBox = Ember.TextField.extend(Ember.TargetActionSupport,{
	type:'text',
	placeholder:'Search...',
	style:'line-height: 24px;vertical-align: middle;border-radius: 6px;',
	insertNewLine:function(){
		this.triggerAction();
	},
	cancel:function(){
		this.set('value',null);
		Ember.run.sync();
		this.triggerAction();
	}
});

De3.TextField = Ember.TextField.extend({
	attributeBindings:['dataProperty:data-property'],
	validationMessage:null
});

De3.SectionHeader = Ember.View.extend({
	layoutName: "sectionHeader_template",
	attributeBindings:['style'],
	classNameBindings:['solidLine:solid'],
	maxWidth:null,
	subTitle:null,
	headerSize: null,
	solidLine:null,
	title: null,
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'headerSize','h1');
		De3.setDefaultProperty(this,'solidLine',false);
		De3.setDefaultProperty(this,'title','untitled');
		De3.setDefaultProperty(this,'maxWidth',100);
		
	}
});

De3.FormSection = Ember.View.extend({
	title:null,
	noContent:null,
	hideActionBar:null,
	cellSpacing:null,
	layoutName:'formSection_template',
	didInsertElement:function(){
		
	},
	init:function(){
		this._super();
		De3.setDefaultProperty(this,'cellSpacing',4);
	}
});

De3.FormElement = Ember.View.extend({
	layoutName:'formElement_template',
	help:null,
	required:null,
	label:null,
	propertyName:null,
	attributeBindings:['data-property']
});

De3.FormHelp = Ember.View.extend({
	templateName:'formHelpIcon_template'
});

Ember.Checkbox.reopen({
	click:function(event){
		event.stopPropagation();
	}
});

/**
 * This class allow easier hiding and showing of buttons
 * @type @exp;Ember@pro;Object@call;create
 */
De3.IconButtonSetController = Ember.Object.extend({
	buttonSet:null,
	hideButtonSets:[],
	show:function() {
		var animationLength=300;
		var delay=200;
		var hideTimeout=0;
		var showTimeout=0;
		var hiddenButtons=0;
		var _this=this;
		this.get('hideButtonSets').forEach(function(buttonSet){
			$('.'+buttonSet).each(function(){
				hiddenButtons++;
				var iconButton=this;
				setTimeout(function(){
					$(iconButton).addClass('hiddenButton');
				},hideTimeout);
				hideTimeout+=delay;
			});
		});
		showTimeout=delay*(hiddenButtons-1)+animationLength;
		setTimeout(function(){
			_this.get('hideButtonSets').forEach(function(buttonSet){
				$('.'+buttonSet).hide();
			});
			$('.'+_this.get('buttonSet')).show();
		},showTimeout);
		showTimeout+=16;
		$('.'+this.get('buttonSet')).each(function(){
			var iconButton=this;
			setTimeout(function(){
				$(iconButton).removeClass('hiddenButton');
			},showTimeout);
			showTimeout+=delay;
		});
	},
	hide:function() {
		var animationLength=300;
		var delay=200;
		var hideTimeout=0;
		var showTimeout=0;
		var hiddenButtons=0;
		var _this=this;
		if($.isArray(this.get('buttonSet'))){
			this.get('buttonSet').forEach(function(buttonSet){
				$('.'+buttonSet).each(function(){
					hiddenButtons++;
					var iconButton=this;
					setTimeout(function(){
						$(iconButton).addClass('hiddenButton');
					},hideTimeout);
					hideTimeout+=delay;
				});
			});
		}
		showTimeout=delay*(hiddenButtons-1)+animationLength;
		setTimeout(function(){
			_this.get('buttonSet').forEach(function(buttonSet){
				$('.'+buttonSet).hide();
			});
			_this.get('hideButtonSets').forEach(function(buttonSet){
				$('.'+buttonSet).show();
			});
		},showTimeout);
		showTimeout+=16;
		this.get('hideButtonSets').forEach(function(buttonSet){
			setTimeout(function(){
				$('.'+buttonSet).removeClass('hiddenButton');
			},showTimeout);
			showTimeout+=delay;
		});
	}
});

De3.IconButton = Ember.View.extend(Ember.ViewTargetActionSupport,{
	templateName:'iconButton_template',
	tagName:'button',
	hidden:null,
	imageUrl:null,
	attributeBindings:['type','title','style','disabled'],
	type:'button',
	show:true,
	removeOnHide:null,
	colour:'black',
	disabled: function() {
		return this.get('hidden') || !this.get('show');
	}.property('hidden','show'),
	title:null,
	click:function(){
		this.triggerAction();
	},
	classNames:'action iconButton',
	classNameBindings:['hidden:hiddenButton','removeOnHide:removeOnHide', 'show:visibleButton:hiddenButton','buttonSet']
});

De3.InputNameValue = De3.FormElement.extend({
	target: null,
	addAction: null,
	templateName: 'inputNameValue_template'
});

De3.OutputText = De3.FormElement.extend({
	templateName:'outputText_template',
	layoutName:'formElement_template'
});
De3.InputText = De3.FormElement.extend({
	templateName:'inputText_template'
});
De3.InputTextArea = De3.FormElement.extend({
	templateName:'inputTextArea_template',
	layoutName:'formElement_template'
});
De3.InputSecret = De3.FormElement.extend({
	templateName:'inputSecret_template',
	layoutName:'formElement_template'
});
De3.InputNumber = De3.FormElement.extend({
	templateName:'inputNumber_template',
	layoutName:'formElement_template',
	min:null,
	max:null,
	step:null,
	pattern:'[0-9]+',
	init: function() {
		this._super();
		De3.setDefaultProperty(this,'min',0);
	}
});

De3.FormCheckBox = De3.FormElement.extend({
	templateName:'checkBox_template'
});

De3.SelectManyListBox = De3.FormElement.extend({
	templateName:'selectbox_template',
	layoutName:'formElement_template',
	multiple:'multiple'
});

De3.SelectSingleListBox = De3.FormElement.extend({
	templateName:'selectbox_template',
	layoutName:'formElement_template',
	multiple:null
});

De3.ToggleTextField = Ember.ContainerView.extend(Ember.TargetActionSupport,{
	tagName:'span',
	classNames:'toggleTextField',
	value:null,
	required:false,
	childViews:['textView','inputView'],
	editMode:false,
	defaultValue:null,
	emptyValue:'Not Specified',
	doubleClick: function() {
		this.set('editMode',true);
	},
	textView: Ember.View.extend({
		tagName:'span',
		attributeBindings:['title'],
		classNames:['toggleTextView'],
		title:'Double click to edit',
		valueBinding:'parentView.value',
		emptyValueBinding:'parentView.emptyValue',
		template:Ember.Handlebars.compile('{{#if view.value}}{{view.value}}{{else}}<span class="messages">{{view.emptyValue}}</span>{{/if}}'),
		classNameBindings:['editMode:hidden:visible'],
		editModeBinding:'parentView.editMode'
	}),
	inputView: Ember.TextField.extend({
		classNameBindings:['editMode:visible:hidden'],
		editModeBinding:'parentView.editMode',
		valueBinding:'parentView.value',
		insertNewline:function() {
			this.set('parentView.editMode',false);
			this.get('parentView').triggerAction();
		},
		focusOut:function(){
			this.set('parentView.editMode',false);
			this.get('parentView').triggerAction();
		},
		cancel:function() {
			this.set('parentView.editMode',false);
		}
	})
});

De3.InputTextField = Ember.TextField.extend({
	classNames:'BorderlessTextField toggleTextView',
	attributeBindings:['title','placeholder','style','type'],
	title:'Just type to edit',
	placeholder:'Type Here...',
	type:"text",
	style:'',
	value:'',
	object:'',
	cancel: function() {
		this.set('object',null);
	},
	drop:function(event){
		DragNDrop.cancel(event);
	}
});
Env.TabPanel = Ember.View.extend({
	templateName:'tabPanel',
	classNames:['topNav'],
	tabs:null,
	selectTabByTitle:function(title){
		this.get('tabs').forEach(function(aTab){
			if(title===aTab.get('title')) {
				aTab.set('selected',true);
			} else {
				aTab.set('selected',false);
			}
		});
	},
	init:function(){
		this._super();
		if(objExists(this.get('tabs.firstObject')) && !objExists(this.get('tabs').filterProperty('selected',true))){
			this.set('tabs.firstObject.selected',true);
		}
	}
});
Env.Tab = Ember.View.extend({
	tagName:'li',
	classNameBindings:['selected:subSelectionActive'],
	template:Ember.Handlebars.compile('<a href="#">{{view.title}}</a>'),
	title:null,
	tabView:null,
	selected:null,
	click:function(){
		this.get('parentView').selectTabByTitle(this.get('title'));
	}
});
		
Handlebars.registerHelper('ifNotAllExist', function(v1, v2, options) {
  if(!objExists(v1) ||  !objExists(v2)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

/**************************
* Controllers
**************************/
Env.RunningTask = Ember.Object.extend({
	id:null,
	state:null,
	taskName:null,
	createdOn:null,
	caughtExceptionMessage:null,
	timeStarted:null,
	timeTaken:null,
	percentageDone:null,
	stoppedGracefully:null
});
Env.RunningTaskController = Ember.ObjectController.extend({
	service:null,
	intervalRunner:null,
	interval:1000,
	http:'post',
	disabledButtons:null,
	start: function(payload,disabledButtons){
		var _this=this;
		if(objExists(disabledButtons)) {
			this.set('disabledButtons',disabledButtons);
			disabledButtons.attr('disabled','disabled');
		}
		
		$.ajax({
			url:this.service,
			type:this.get('http'),
			contentType:'application/json',
			data: payload
		}).then(function(task){
			_this.set('intervalRunner', _this._watchRunningTask(task));
		});
	},
	_watchRunningTask: function(task) {
		var _this = this;
		if(objExists(this.get('intervalRunner'))) {
			if(objExists(console)) {
				console.log("Warning: Cannot run multiple idential background tasks");
			}
			return this.get('intervalRunner');
		}
		this.set('content', Env.RunningTask.create(task));
		return setInterval(function(){
			$.getJSON('rest/RunningTasks/'+_this.get('content.id')).success(function(response){
				_this.set('content', Env.RunningTask.create(response));
				if(response.state==="COMPLETE" || response.state==="ERROR") {
					window.clearInterval(_this.get('intervalRunner'));
					_this.set('intervalRunner',null);
					if(objExists(_this.get('disabledButtons'))) {
						_this.get('disabledButtons').removeAttr('disabled');
					}
				}
			});
		},this.get('interval'));
	}
});

De3.WebResultFieldController = Ember.ArrayController.extend({
	content: Ember.A(),
	sortProperties:['name'],
	init: function() {
		var _this = this;
		$.get('rest/WebResultFieldApi',function(data) {
			data.forEach(function(row) {
				var newObj = De3.WebResultField.create();
				newObj.setProperties(row);
				_this.get('content').pushObject(newObj);
			});
		});
	}
});
De3.ScansController = Ember.ArrayController.extend({
	content: Ember.A(),
	sortProperties:['name'],
	init: function() {
		var _this = this;
		$.get('rest/ScansApi', function(data) {
			data.forEach(function(row) {
				var newObj = De3.Scan.create();
				newObj.setProperties(row);
				_this.get('content').pushObject(newObj);
			});
		});
	}
});
			
De3.SavedViewController = Ember.ArrayController.extend({
	content:Em.A(),
	sortProperties:['name'],
	onUpdate:function(){},
	load:function() {
		var _this=this;
		$.get('rest/SavedViewApi').success(function(data) {
			data.results.forEach(function(i) {
				_this.get('content').pushObject(De3.SavedView.create(data));
			});
			_this.onUpdate();
		}).error(function(data) {
			throw "SavedViewApi request failed";
		});
	}
});


De3.UserSession = Ember.Object.extend({
	currentUser:null,
	logout:function() { 
		$.get('rest/auth/logout').success(function() {
			document.location.reload(true);
		});
	},
	load:function(callBackFn) {
		var _this=this;
		$.get('rest/auth/currentUser').success(function(response) {
			_this.set('currentUser',De3.UserLogin.create(response));
			if(objExists(callBackFn)) {
				callBackFn();
			}
		});
	}
});

Env.VerticalDividerView = Ember.View.extend({
	tagName:'section',
	style:'display:table-cell; height:98%;width:2px; margin-right:4px; margin-left:4px;',
	classNames:['verticalDivider']
});


De3.DateTextField = Ember.TextField.extend({
	didInsertElement:function() {
		this.$().datepicker();
		this.$().datepicker( "option", "dateFormat", "d M yy" );
	}
});



/***********************************
*	Functions
***********************************/
De3.setDefaultProperty = function(obj,property,defaultValue) {
	if(!objExists(obj.get(property))) {
		obj.set(property,defaultValue);
	}
}

Env.removeAllQtips = function() {
	$('.qtip2').each(function() {
		var qtip = $(this).removeClass('qtip2 ui-state-error').qtip();
		if(objExists(qtip.destroy)) {
			qtip.destroy();
		}
	});
}


Env.errorQtip = function($el,message) {
	$el.attr('title',message).addClass('ui-state-error qtip2').qtip({
				position: {
					my: 'left center',
					at:'right center',
					adjust : {
						screen : true
					}
				},
				show: {
					event: false, 
					ready: true 
				},
				hide: false 
	});
}
Env.HttpVerbs = ['GET','POST'];
Env.DateFormats = ['d','M','YYYY'];
Env.DateFields = ['DAY_OF_MONTH','HOUR_OF_DAY','MINUTE'];
Env.DateIncrements = ['-60','-30','-15','-10','-7','-5','-2','-1','0','1','2','5','7','10','15','30','60']
Env.BooleanValues = ['TRUE','FALSE'];
Env.SnapshotVerbs = ['Take Snapshot','No Snapshot'];

Env.exception =function(name,msg) {
    try {
        throw new Error("")
    } catch (e) {
        e.stack = e.stack.split("@"+e.fileName+":").join(":");
        full_stack = e.stack.split("\\n");
        stack = [];
        stack[0] = "Exception: "+name+"(\""+msg+"\")"
        for (var i=2;i<full_stack.length-3;i++) {
            entry = full_stack[i];
            entry_detailed = entry.split(":");
            entry_detailed[1] = entry_detailed[1] - 4; // THIS is to
            // mark, that we'll "move" the source 4 lines higher,
            // ... because it's eval code executed. Remove that for
            // clear values.
            if (i==2) lineNumber = entry_detailed[1];
            stack[i] = entry_detailed.join(":");
        }
        return {
            name:name,
            message:msg,
            stack:stack.join("\\n"),
            lineNumber:lineNumber
        };
    }
}

Env.handleAjaxError = function(response,view) {
	var _this=view;
	if(response.status===400) {
		try {
		var errorMessage = JSON.parse(response.responseText);
		} catch(error) {
			if(objExists(console)){
				console.log("Unable to parse response: "+error);
				new Notification().error("failed "+response.responseText);
				return;
			}
		}
		if(objExists(view)) {
			if(objExists(errorMessage[0])) {
				errorMessage.forEach(function(error) {
					Env.errorQtip(Env.selectFieldForValidationError(_this,error),error.message);
				});
			} else if(objExists(errorMessage.propertyPath)){
				Env.errorQtip(Env.selectFieldForValidationError(_this,errorMessage),errorMessage.message);
			} else if(errorMessage.propertyPath==="") {
				_this.set('generalError',errorMessage.message);
				new Notification().error(response.responseText);
			} else {
				new Notification().error("failed "+response.responseText);
			}
		} else {
			if(objExists(errorMessage[0])) {
				errorMessage.forEach(function(error) {
					new Notification().error(error.message);
				});
			} else if(errorMessage.propertyPath==="") {
				_this.set('generalError',errorMessage.message);
				new Notification().error(response.responseText);
			} else {
				new Notification().error("failed "+response.responseText);
			}
		}
		
	} else {
		new Notification().error("failed "+response.responseText);
	}
}

Env.restrictTabKeyTo = function ($el) {
	// gather all inputs of selected types
		var inputs = $el.find('input, textarea, select'), inputTo;
		inputs.off('keydown');
		// bind on keydown
		inputs.on('keydown', function(e) {

			// if we pressed the tab
			if (e.keyCode == 9 || e.which == 9) {
				// prevent default tab action
				e.preventDefault();

				if (e.shiftKey) {
					// get previous input based on the current input
					inputTo = inputs.get(inputs.index(this) - 1);
				} else {
					// get next input based on the current input
					inputTo = inputs.get(inputs.index(this) + 1);
				}

				// move focus to inputTo, otherwise focus first input
				if (inputTo) {
					inputTo.focus();
				} else {
					inputs[0].focus();
				}
			}
		});
}

Env.stripReservedChars = function (data) {
	var reservedChars = "+*-!(){}[]^\"~:\\?";
	var images = jQuery.map(data.split(''), 
		function(c) {
			if($.inArray(c,reservedChars)>0) {
				return "\\"+c;
			}
			return c;
		});
	return images.join('');
}

Env.BrowserDetect = Ember.Object.create({
    init: function () 
    {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) ||       this.searchVersion(navigator.appVersion) || "Unknown";
    },

    searchString: function (data) 
    {
        for (var i=0 ; i < data.length ; i++)   
        {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) != -1)
            {
                return data[i].identity;
            }
        }
    },

    searchVersion: function (dataString) 
    {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },

    dataBrowser: 
    [
        { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome" },
        { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer" },
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
        { string: navigator.userAgent, subString: "Safari",  identity: "Safari" },
        { string: navigator.userAgent, subString: "Opera",   identity: "Opera" },
    ],
	isIe:function(){
		return this.browser==="Explorer";
	}
});
Env.BrowserDetect.init();

Env.DateFormat = "D MMM YYYY";

// moment.js
// version : 2.1.0
// author : Tim Wood
// license : MIT
// momentjs.com
!function(t){function e(t,e){return function(n){return u(t.call(this,n),e)}}function n(t,e){return function(n){return this.lang().ordinal(t.call(this,n),e)}}function s(){}function i(t){a(this,t)}function r(t){var e=t.years||t.year||t.y||0,n=t.months||t.month||t.M||0,s=t.weeks||t.week||t.w||0,i=t.days||t.day||t.d||0,r=t.hours||t.hour||t.h||0,a=t.minutes||t.minute||t.m||0,o=t.seconds||t.second||t.s||0,u=t.milliseconds||t.millisecond||t.ms||0;this._input=t,this._milliseconds=u+1e3*o+6e4*a+36e5*r,this._days=i+7*s,this._months=n+12*e,this._data={},this._bubble()}function a(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}function o(t){return 0>t?Math.ceil(t):Math.floor(t)}function u(t,e){for(var n=t+"";n.length<e;)n="0"+n;return n}function h(t,e,n,s){var i,r,a=e._milliseconds,o=e._days,u=e._months;a&&t._d.setTime(+t._d+a*n),(o||u)&&(i=t.minute(),r=t.hour()),o&&t.date(t.date()+o*n),u&&t.month(t.month()+u*n),a&&!s&&H.updateOffset(t),(o||u)&&(t.minute(i),t.hour(r))}function d(t){return"[object Array]"===Object.prototype.toString.call(t)}function c(t,e){var n,s=Math.min(t.length,e.length),i=Math.abs(t.length-e.length),r=0;for(n=0;s>n;n++)~~t[n]!==~~e[n]&&r++;return r+i}function f(t){return t?ie[t]||t.toLowerCase().replace(/(.)s$/,"$1"):t}function l(t,e){return e.abbr=t,x[t]||(x[t]=new s),x[t].set(e),x[t]}function _(t){if(!t)return H.fn._lang;if(!x[t]&&A)try{require("./lang/"+t)}catch(e){return H.fn._lang}return x[t]}function m(t){return t.match(/\[.*\]/)?t.replace(/^\[|\]$/g,""):t.replace(/\\/g,"")}function y(t){var e,n,s=t.match(E);for(e=0,n=s.length;n>e;e++)s[e]=ue[s[e]]?ue[s[e]]:m(s[e]);return function(i){var r="";for(e=0;n>e;e++)r+=s[e]instanceof Function?s[e].call(i,t):s[e];return r}}function M(t,e){function n(e){return t.lang().longDateFormat(e)||e}for(var s=5;s--&&N.test(e);)e=e.replace(N,n);return re[e]||(re[e]=y(e)),re[e](t)}function g(t,e){switch(t){case"DDDD":return V;case"YYYY":return X;case"YYYYY":return $;case"S":case"SS":case"SSS":case"DDD":return I;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return R;case"a":case"A":return _(e._l)._meridiemParse;case"X":return B;case"Z":case"ZZ":return j;case"T":return q;case"MM":case"DD":case"YY":case"HH":case"hh":case"mm":case"ss":case"M":case"D":case"d":case"H":case"h":case"m":case"s":return J;default:return new RegExp(t.replace("\\",""))}}function p(t){var e=(j.exec(t)||[])[0],n=(e+"").match(ee)||["-",0,0],s=+(60*n[1])+~~n[2];return"+"===n[0]?-s:s}function D(t,e,n){var s,i=n._a;switch(t){case"M":case"MM":i[1]=null==e?0:~~e-1;break;case"MMM":case"MMMM":s=_(n._l).monthsParse(e),null!=s?i[1]=s:n._isValid=!1;break;case"D":case"DD":case"DDD":case"DDDD":null!=e&&(i[2]=~~e);break;case"YY":i[0]=~~e+(~~e>68?1900:2e3);break;case"YYYY":case"YYYYY":i[0]=~~e;break;case"a":case"A":n._isPm=_(n._l).isPM(e);break;case"H":case"HH":case"h":case"hh":i[3]=~~e;break;case"m":case"mm":i[4]=~~e;break;case"s":case"ss":i[5]=~~e;break;case"S":case"SS":case"SSS":i[6]=~~(1e3*("0."+e));break;case"X":n._d=new Date(1e3*parseFloat(e));break;case"Z":case"ZZ":n._useUTC=!0,n._tzm=p(e)}null==e&&(n._isValid=!1)}function Y(t){var e,n,s=[];if(!t._d){for(e=0;7>e;e++)t._a[e]=s[e]=null==t._a[e]?2===e?1:0:t._a[e];s[3]+=~~((t._tzm||0)/60),s[4]+=~~((t._tzm||0)%60),n=new Date(0),t._useUTC?(n.setUTCFullYear(s[0],s[1],s[2]),n.setUTCHours(s[3],s[4],s[5],s[6])):(n.setFullYear(s[0],s[1],s[2]),n.setHours(s[3],s[4],s[5],s[6])),t._d=n}}function w(t){var e,n,s=t._f.match(E),i=t._i;for(t._a=[],e=0;e<s.length;e++)n=(g(s[e],t).exec(i)||[])[0],n&&(i=i.slice(i.indexOf(n)+n.length)),ue[s[e]]&&D(s[e],n,t);i&&(t._il=i),t._isPm&&t._a[3]<12&&(t._a[3]+=12),t._isPm===!1&&12===t._a[3]&&(t._a[3]=0),Y(t)}function k(t){var e,n,s,r,o,u=99;for(r=0;r<t._f.length;r++)e=a({},t),e._f=t._f[r],w(e),n=new i(e),o=c(e._a,n.toArray()),n._il&&(o+=n._il.length),u>o&&(u=o,s=n);a(t,s)}function v(t){var e,n=t._i,s=K.exec(n);if(s){for(t._f="YYYY-MM-DD"+(s[2]||" "),e=0;4>e;e++)if(te[e][1].exec(n)){t._f+=te[e][0];break}j.exec(n)&&(t._f+=" Z"),w(t)}else t._d=new Date(n)}function T(e){var n=e._i,s=G.exec(n);n===t?e._d=new Date:s?e._d=new Date(+s[1]):"string"==typeof n?v(e):d(n)?(e._a=n.slice(0),Y(e)):e._d=n instanceof Date?new Date(+n):new Date(n)}function b(t,e,n,s,i){return i.relativeTime(e||1,!!n,t,s)}function S(t,e,n){var s=W(Math.abs(t)/1e3),i=W(s/60),r=W(i/60),a=W(r/24),o=W(a/365),u=45>s&&["s",s]||1===i&&["m"]||45>i&&["mm",i]||1===r&&["h"]||22>r&&["hh",r]||1===a&&["d"]||25>=a&&["dd",a]||45>=a&&["M"]||345>a&&["MM",W(a/30)]||1===o&&["y"]||["yy",o];return u[2]=e,u[3]=t>0,u[4]=n,b.apply({},u)}function F(t,e,n){var s,i=n-e,r=n-t.day();return r>i&&(r-=7),i-7>r&&(r+=7),s=H(t).add("d",r),{week:Math.ceil(s.dayOfYear()/7),year:s.year()}}function O(t){var e=t._i,n=t._f;return null===e||""===e?null:("string"==typeof e&&(t._i=e=_().preparse(e)),H.isMoment(e)?(t=a({},e),t._d=new Date(+e._d)):n?d(n)?k(t):w(t):T(t),new i(t))}function z(t,e){H.fn[t]=H.fn[t+"s"]=function(t){var n=this._isUTC?"UTC":"";return null!=t?(this._d["set"+n+e](t),H.updateOffset(this),this):this._d["get"+n+e]()}}function C(t){H.duration.fn[t]=function(){return this._data[t]}}function L(t,e){H.duration.fn["as"+t]=function(){return+this/e}}for(var H,P,U="2.1.0",W=Math.round,x={},A="undefined"!=typeof module&&module.exports,G=/^\/?Date\((\-?\d+)/i,Z=/(\-)?(\d*)?\.?(\d+)\:(\d+)\:(\d+)\.?(\d{3})?/,E=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,N=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,J=/\d\d?/,I=/\d{1,3}/,V=/\d{3}/,X=/\d{1,4}/,$=/[+\-]?\d{1,6}/,R=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,j=/Z|[\+\-]\d\d:?\d\d/i,q=/T/i,B=/[\+\-]?\d+(\.\d{1,3})?/,K=/^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,Q="YYYY-MM-DDTHH:mm:ssZ",te=[["HH:mm:ss.S",/(T| )\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],ee=/([\+\-]|\d\d)/gi,ne="Date|Hours|Minutes|Seconds|Milliseconds".split("|"),se={Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6},ie={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",w:"week",M:"month",y:"year"},re={},ae="DDD w W M D d".split(" "),oe="M D H h m s w W".split(" "),ue={M:function(){return this.month()+1},MMM:function(t){return this.lang().monthsShort(this,t)},MMMM:function(t){return this.lang().months(this,t)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(t){return this.lang().weekdaysMin(this,t)},ddd:function(t){return this.lang().weekdaysShort(this,t)},dddd:function(t){return this.lang().weekdays(this,t)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return u(this.year()%100,2)},YYYY:function(){return u(this.year(),4)},YYYYY:function(){return u(this.year(),5)},gg:function(){return u(this.weekYear()%100,2)},gggg:function(){return this.weekYear()},ggggg:function(){return u(this.weekYear(),5)},GG:function(){return u(this.isoWeekYear()%100,2)},GGGG:function(){return this.isoWeekYear()},GGGGG:function(){return u(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return~~(this.milliseconds()/100)},SS:function(){return u(~~(this.milliseconds()/10),2)},SSS:function(){return u(this.milliseconds(),3)},Z:function(){var t=-this.zone(),e="+";return 0>t&&(t=-t,e="-"),e+u(~~(t/60),2)+":"+u(~~t%60,2)},ZZ:function(){var t=-this.zone(),e="+";return 0>t&&(t=-t,e="-"),e+u(~~(10*t/6),4)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},X:function(){return this.unix()}};ae.length;)P=ae.pop(),ue[P+"o"]=n(ue[P],P);for(;oe.length;)P=oe.pop(),ue[P+P]=e(ue[P],2);for(ue.DDDD=e(ue.DDD,3),s.prototype={set:function(t){var e,n;for(n in t)e=t[n],"function"==typeof e?this[n]=e:this["_"+n]=e},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(t){return this._months[t.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(t){return this._monthsShort[t.month()]},monthsParse:function(t){var e,n,s;for(this._monthsParse||(this._monthsParse=[]),e=0;12>e;e++)if(this._monthsParse[e]||(n=H([2e3,e]),s="^"+this.months(n,"")+"|^"+this.monthsShort(n,""),this._monthsParse[e]=new RegExp(s.replace(".",""),"i")),this._monthsParse[e].test(t))return e},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(t){return this._weekdays[t.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(t){return this._weekdaysShort[t.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(t){return this._weekdaysMin[t.day()]},weekdaysParse:function(t){var e,n,s;for(this._weekdaysParse||(this._weekdaysParse=[]),e=0;7>e;e++)if(this._weekdaysParse[e]||(n=H([2e3,1]).day(e),s="^"+this.weekdays(n,"")+"|^"+this.weekdaysShort(n,"")+"|^"+this.weekdaysMin(n,""),this._weekdaysParse[e]=new RegExp(s.replace(".",""),"i")),this._weekdaysParse[e].test(t))return e},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(t){var e=this._longDateFormat[t];return!e&&this._longDateFormat[t.toUpperCase()]&&(e=this._longDateFormat[t.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(t){return t.slice(1)}),this._longDateFormat[t]=e),e},isPM:function(t){return"p"===(t+"").toLowerCase()[0]},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(t,e,n){return t>11?n?"pm":"PM":n?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(t,e){var n=this._calendar[t];return"function"==typeof n?n.apply(e):n},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(t,e,n,s){var i=this._relativeTime[n];return"function"==typeof i?i(t,e,n,s):i.replace(/%d/i,t)},pastFuture:function(t,e){var n=this._relativeTime[t>0?"future":"past"];return"function"==typeof n?n(e):n.replace(/%s/i,e)},ordinal:function(t){return this._ordinal.replace("%d",t)},_ordinal:"%d",preparse:function(t){return t},postformat:function(t){return t},week:function(t){return F(t,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6}},H=function(t,e,n){return O({_i:t,_f:e,_l:n,_isUTC:!1})},H.utc=function(t,e,n){return O({_useUTC:!0,_isUTC:!0,_l:n,_i:t,_f:e})},H.unix=function(t){return H(1e3*t)},H.duration=function(t,e){var n,s,i=H.isDuration(t),a="number"==typeof t,o=i?t._input:a?{}:t,u=Z.exec(t);return a?e?o[e]=t:o.milliseconds=t:u&&(n="-"===u[1]?-1:1,o={y:0,d:~~u[2]*n,h:~~u[3]*n,m:~~u[4]*n,s:~~u[5]*n,ms:~~u[6]*n}),s=new r(o),i&&t.hasOwnProperty("_lang")&&(s._lang=t._lang),s},H.version=U,H.defaultFormat=Q,H.updateOffset=function(){},H.lang=function(t,e){return t?(e?l(t,e):x[t]||_(t),H.duration.fn._lang=H.fn._lang=_(t),void 0):H.fn._lang._abbr},H.langData=function(t){return t&&t._lang&&t._lang._abbr&&(t=t._lang._abbr),_(t)},H.isMoment=function(t){return t instanceof i},H.isDuration=function(t){return t instanceof r},H.fn=i.prototype={clone:function(){return H(this)},valueOf:function(){return+this._d+6e4*(this._offset||0)},unix:function(){return Math.floor(+this/1e3)},toString:function(){return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){return M(H(this).utc(),"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var t=this;return[t.year(),t.month(),t.date(),t.hours(),t.minutes(),t.seconds(),t.milliseconds()]},isValid:function(){return null==this._isValid&&(this._isValid=this._a?!c(this._a,(this._isUTC?H.utc(this._a):H(this._a)).toArray()):!isNaN(this._d.getTime())),!!this._isValid},utc:function(){return this.zone(0)},local:function(){return this.zone(0),this._isUTC=!1,this},format:function(t){var e=M(this,t||H.defaultFormat);return this.lang().postformat(e)},add:function(t,e){var n;return n="string"==typeof t?H.duration(+e,t):H.duration(t,e),h(this,n,1),this},subtract:function(t,e){var n;return n="string"==typeof t?H.duration(+e,t):H.duration(t,e),h(this,n,-1),this},diff:function(t,e,n){var s,i,r=this._isUTC?H(t).zone(this._offset||0):H(t).local(),a=6e4*(this.zone()-r.zone());return e=f(e),"year"===e||"month"===e?(s=432e5*(this.daysInMonth()+r.daysInMonth()),i=12*(this.year()-r.year())+(this.month()-r.month()),i+=(this-H(this).startOf("month")-(r-H(r).startOf("month")))/s,i-=6e4*(this.zone()-H(this).startOf("month").zone()-(r.zone()-H(r).startOf("month").zone()))/s,"year"===e&&(i/=12)):(s=this-r,i="second"===e?s/1e3:"minute"===e?s/6e4:"hour"===e?s/36e5:"day"===e?(s-a)/864e5:"week"===e?(s-a)/6048e5:s),n?i:o(i)},from:function(t,e){return H.duration(this.diff(t)).lang(this.lang()._abbr).humanize(!e)},fromNow:function(t){return this.from(H(),t)},calendar:function(){var t=this.diff(H().startOf("day"),"days",!0),e=-6>t?"sameElse":-1>t?"lastWeek":0>t?"lastDay":1>t?"sameDay":2>t?"nextDay":7>t?"nextWeek":"sameElse";return this.format(this.lang().calendar(e,this))},isLeapYear:function(){var t=this.year();return 0===t%4&&0!==t%100||0===t%400},isDST:function(){return this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone()},day:function(t){var e=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=t?"string"==typeof t&&(t=this.lang().weekdaysParse(t),"number"!=typeof t)?this:this.add({d:t-e}):e},month:function(t){var e,n=this._isUTC?"UTC":"";return null!=t?"string"==typeof t&&(t=this.lang().monthsParse(t),"number"!=typeof t)?this:(e=this.date(),this.date(1),this._d["set"+n+"Month"](t),this.date(Math.min(e,this.daysInMonth())),H.updateOffset(this),this):this._d["get"+n+"Month"]()},startOf:function(t){switch(t=f(t)){case"year":this.month(0);case"month":this.date(1);case"week":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===t&&this.weekday(0),this},endOf:function(t){return this.startOf(t).add(t,1).subtract("ms",1)},isAfter:function(t,e){return e="undefined"!=typeof e?e:"millisecond",+this.clone().startOf(e)>+H(t).startOf(e)},isBefore:function(t,e){return e="undefined"!=typeof e?e:"millisecond",+this.clone().startOf(e)<+H(t).startOf(e)},isSame:function(t,e){return e="undefined"!=typeof e?e:"millisecond",+this.clone().startOf(e)===+H(t).startOf(e)},min:function(t){return t=H.apply(null,arguments),this>t?this:t},max:function(t){return t=H.apply(null,arguments),t>this?this:t},zone:function(t){var e=this._offset||0;return null==t?this._isUTC?e:this._d.getTimezoneOffset():("string"==typeof t&&(t=p(t)),Math.abs(t)<16&&(t=60*t),this._offset=t,this._isUTC=!0,e!==t&&h(this,H.duration(e-t,"m"),1,!0),this)},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},daysInMonth:function(){return H.utc([this.year(),this.month()+1,0]).date()},dayOfYear:function(t){var e=W((H(this).startOf("day")-H(this).startOf("year"))/864e5)+1;return null==t?e:this.add("d",t-e)},weekYear:function(t){var e=F(this,this.lang()._week.dow,this.lang()._week.doy).year;return null==t?e:this.add("y",t-e)},isoWeekYear:function(t){var e=F(this,1,4).year;return null==t?e:this.add("y",t-e)},week:function(t){var e=this.lang().week(this);return null==t?e:this.add("d",7*(t-e))},isoWeek:function(t){var e=F(this,1,4).week;return null==t?e:this.add("d",7*(t-e))},weekday:function(t){var e=(this._d.getDay()+7-this.lang()._week.dow)%7;return null==t?e:this.add("d",t-e)},isoWeekday:function(t){return null==t?this.day()||7:this.day(this.day()%7?t:t-7)},lang:function(e){return e===t?this._lang:(this._lang=_(e),this)}},P=0;P<ne.length;P++)z(ne[P].toLowerCase().replace(/s$/,""),ne[P]);z("year","FullYear"),H.fn.days=H.fn.day,H.fn.months=H.fn.month,H.fn.weeks=H.fn.week,H.fn.isoWeeks=H.fn.isoWeek,H.fn.toJSON=H.fn.toISOString,H.duration.fn=r.prototype={_bubble:function(){var t,e,n,s,i=this._milliseconds,r=this._days,a=this._months,u=this._data;u.milliseconds=i%1e3,t=o(i/1e3),u.seconds=t%60,e=o(t/60),u.minutes=e%60,n=o(e/60),u.hours=n%24,r+=o(n/24),u.days=r%30,a+=o(r/30),u.months=a%12,s=o(a/12),u.years=s},weeks:function(){return o(this.days()/7)},valueOf:function(){return this._milliseconds+864e5*this._days+2592e6*(this._months%12)+31536e6*~~(this._months/12)},humanize:function(t){var e=+this,n=S(e,!t,this.lang());return t&&(n=this.lang().pastFuture(e,n)),this.lang().postformat(n)},add:function(t,e){var n=H.duration(t,e);return this._milliseconds+=n._milliseconds,this._days+=n._days,this._months+=n._months,this._bubble(),this},subtract:function(t,e){var n=H.duration(t,e);return this._milliseconds-=n._milliseconds,this._days-=n._days,this._months-=n._months,this._bubble(),this},get:function(t){return t=f(t),this[t.toLowerCase()+"s"]()},as:function(t){return t=f(t),this["as"+t.charAt(0).toUpperCase()+t.slice(1)+"s"]()},lang:H.fn.lang};for(P in se)se.hasOwnProperty(P)&&(L(P,se[P]),C(P.toLowerCase()));L("Weeks",6048e5),H.duration.fn.asMonths=function(){return(+this-31536e6*this.years())/2592e6+12*this.years()},H.lang("en",{ordinal:function(t){var e=t%10,n=1===~~(t%100/10)?"th":1===e?"st":2===e?"nd":3===e?"rd":"th";return t+n}}),A&&(module.exports=H),"undefined"==typeof ender&&(this.moment=H),"function"==typeof define&&define.amd&&define("moment",[],function(){return H})}.call(this);
																																																																			
moment.lang('en', {
			calendar : {
				lastDay : '[Yesterday at] LT',
				sameDay : '[Today at] LT',
				nextDay : '[Tomorrow at] LT',
				lastWeek : '[last] dddd [at] LT',
				nextWeek : 'dddd [at] LT',
				sameElse : 'LLL'
			}
		});			
		
Handlebars.registerHelper('easyCalendar', function(time) {
	if (time != null) {
		return moment(time).calendar();
	} else {
		return null;
	}
});