
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

function makeGeneralValidationMessage(data) {
	if(!objExists(data.propertyPath)) {
		return data.message;
	}
	return data.propertyPath+": "+data.message;
}

function objExists(obj) {
	return obj!==undefined && obj !==null && obj!=="" && obj!=0;
}
function getCalendarRanges() {
	return [{name:"Day",type:"CURRENT_DAY"},{name:"Week",type:"CURRENT_WEEK"},{name:"Month",type:"CURRENT_MONTH"}];
}

function Notification() {}

Notification.prototype = {
	info: function(message,title) {
		$.jGrowl(message,{
			life: 10000,
			header:title,
			easing:"swing"});
	},
	systemMessage: function(message) {
		$.jGrowl(message,{
			header:"System Message",
			theme:"jgrowl-WARNING",
			sticky: true ,
			easing:"swing"});
	},
	error: function(message,title,detail) {
		if(!objExists(title)) {
			title="An Error Occured";
		}
		if(objExists(console)) {
			var consoleMessage = title+": "+message;
			if(objExists(detail)) {
				consoleMessage+="\nDetailed output: "+detail;
			}
			console.log(consoleMessage);
		}
		$.jGrowl(message,{
			life: 10000,
			header:title,
			easing:"swing",
			theme:"jgrowl-ERROR"});
	}
}

