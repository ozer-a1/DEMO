if ((typeof (Dell) === 'undefined') || (Dell=== null)) {
        var Dell = {};
}

(function(rootNameSpace, $)
{	
	var selectors = {
			inputTime:null,
			inputMinute:null,
			divErrors:null,
			divResult:null,
			btnCalculate:null
	};
	var messages = 
	{
		invalidEntry:"Please enter in hh:mm am/pm format",
		enterHour : 'Please enter hour',
		enterNumericHour : 'Please enter numeric hour',
		enterMinute : 'Please enter minute',
		enterNumericMinute: 'Please enter numeric minute',
		hourMax : "Hour may not exceed 12.",
		invalidSep:"Please separate hours and minutes with a :",
		minuteMax : "Minute may not exceed 59",
		enterAMPM: "Please enter AM or PM",
		enterMinutesToAdd : "Please enter number of minutes to add.",
		enterNumericMinutesToAdd : "Minutes to add must be a number"
	};
	var errors = [];
	var parsedHour= null;
	var parsedMinute = null;
	var parsedAMPM = null;
	var priorVal = "";
	var isNumber = function(n) 
	{
		if ( n == ''){return true;}
		return !isNaN(parseFloat(n)) && isFinite(n);
	};
	var displayErrors = function(errors){
		$(selectors.divResult).hide();
		clearErrors();
		$(selectors.divErrors).html(
			JSON.stringify(errors)
		);
	};
	var getLastChar = function(){
		var val = $(selectors.inputTime).val();
		return val.substring(val.length-1, val.length);
	};
	var rollback=function(){
		var val = $(selectors.inputTime).val(priorVal);		
	}	
	var clearErrors = function(){
		errors = [];		
		$(selectors.divErrors).html('');			
	};
	var isValid = function(value){
		parseInput(value);
		if ( parsedHour == null ||parsedHour.length < 2 ){
				errors.push(messages.enterHour);
				displayErrors(errors);
			} else if ( parsedMinute == null || parsedMinute.length < 2 ){
				errors.push(messages.enterMinute);
				displayErrors(errors);
			} else if (parsedAMPM == null || parsedAMPM.length != 2){
				errors.push(messages.enterAMPM);
				displayErrors(errors);
			} else if(errors.length == 0) {
				return true;
			}
			return false;
	};
	var parseInput = function(value)
	{
		var hour, minute, ampm;
		errors = [];
			
		var char =  getLastChar();//String.fromCharCode(event.keyCode);

		if ( value.length == 1 && char == ' ' ) { // no leading spaces
			errors.push(messages.enterNumericHour);
			rollback();
			return;
		}

		var hm = value.split(":");

		if ( hm.length == 0){
			errors.push(messages.enterHour);
		}

		if ( hm.length >= 1 && hm.length < 3){
			hour = hm[0];
			if ( !isNumber(hour)){
				errors.push(messages.enterNumericHour);
				rollback();
			} else{		
				if ( hour == '00'){
					rollback();
				}	
				if ( hour>=10 && hour.length > 2){ // take out leading 0s
					hour = hour * 1;
					$(selectors.inputTime).val(hour);
				}
				if ( hour>12 ){
					errors.push(messages.hourMax);
					rollback();
				}
			}				
		} else {
			errors.push(messages.invalidEntry);
		}

		if ( hm.length < 2 && ( char == ' ' ) ){
			rollback();
			$(selectors.inputTime).val(priorVal+':');
		}

		if ( hm.length == 2){

			if (hour.length == 1){ // pad hr
				$(selectors.inputTime).val('0' + $(selectors.inputTime).val().toString());
			}					

			mt = hm[1].split(' ');
			minute = mt[0];
				
			if ( !isNumber(mt[0]) || mt[0].trim() == '' ){
				if( char != ':' ){
					errors.push(messages.enterNumericMinute);
					rollback();
				}
			} else{			
				if ( mt[0] > 59 ){
					errors.push(messages.minuteMax);
					rollback();
				}
			}
						
			if ( mt.length == 2 ){				
				if (minute.length == 1){ // pad minute
					mt[0] = $(selectors.inputTime).val().toString().replace(':', ':0');
					$(selectors.inputTime).val(mt[0]);
					minute = mt[0];
				} 

				first = mt[1].toLowerCase().substring(0,1);
				second = mt[1].toLowerCase().substring(1,2);
								
				if ( mt[1].length >= 1 &&  ( first != 'a' && first != 'p') ){
					errors.push(messages.enterAMPM);
					rollback();				
				} else if ( mt[1].length == 2 && second!= 'm' ){
					errors.push(messages.enterAMPM);
					rollback();				
				}  else if (mt[1].length > 2 ) { 
					errors.push(messages.enterAMPM);
					rollback();				
				} else {
					ampm = first + second;
				}

			} else {
				if ( mt.length > 2){ // only single space before am/pm
					errors.push(messages.enterAMPM);
					rollback();				
				}

				if (minute.length >= 3){ // pad w/ space before am/pm
					if ( char.toLowerCase() == 'a' || char.toLowerCase() == 'p'){
						rollback();
						$(selectors.inputTime).val(priorVal + ' '  + char);
					} else { // invalid entry
						errors.push(messages.enterAMPM);
						rollback();
					}
				}
			}
		}

		parsedHour = hour;
		parsedMinute = minute;
		parsedAMPM = ampm;
				
		return errors.length == 0;
	};
	var addMinutes = function (value){
		console.log('adding' + value + ' to ' + parsedHour + ' ' + parsedMinute + ' ' + parsedAMPM);		
	}

	this.TimeCalculator = {	
		init:function TimeCalculator$init(params){
			if ( params != undefined && params.selectors != undefined) 
				selectors = params.selectors;
			
			$(selectors.inputTime).keydown(this.capturePriorVal);
			$(selectors.inputTime).keyup(this.preValidate);
			$(selectors.inputMinute).focus(function(){this.select();});
			$(selectors.inputMinute).keypress(function (e) {
				if (e.which == 13) {
					$(selectors.btnCalculate).click();
				}
			});

			$(selectors.btnCalculate).click(this.calculate);
		},		
		capturePriorVal: function TimeCalculator$capturePriorVal(){
			priorVal = $(selectors.inputTime).val();
		},	
		preValidate:function TimeCalculator$preValidate(event){
			var result = parseInput($(selectors.inputTime).val());
			if ( !result )
				displayErrors(errors);
			else
				clearErrors();
		},
		calculate: function TimeCalculator$calculate(){			
			
			var inputTime = $(selectors.inputTime).val();
			var minutesToAdd = $(selectors.inputMinute).val();
			
			if ( !isValid(inputTime) )
				return;
			
			if ( minutesToAdd.length == 0 )
				errors.push(messages.enterMinutesToAdd);

			if ( !isNumber(minutesToAdd)) 
				errors.push(messages.enterNumericMinutesToAdd);
				
			if ( errors.length > 0 ){
				displayErrors(errors);
				return;
			}

			var data = {
				"time": inputTime,
				"minutes": minutesToAdd
			};

			clearErrors();
			
			var onSuccess = function(data) {
				$(selectors.divResult).html(data.result);
				$(selectors.divResult).show();
				$(selectors.btnCalculate).attr("disabled", false);
			};

			var onFail = function(data){
				$(selectors.divResult).hide();
				displayErrors(data.errors);
				$(selectors.btnCalculate).attr("disabled", false);
			};

			$(selectors.btnCalculate).attr("disabled", true);
			$.ajax({
				type: "POST", // HTTP method
				url: '/api/time/',
				contentType: "application/json; charset=utf-8", //request the result to be in JSON
				dataType: "json",
				data : JSON.stringify(data),
				success: onSuccess,
				fail : onFail
			});

		}
	};

	rootNameSpace.TimeCalculator = this.TimeCalculator;
})(Dell, jQuery);


$(function() {
	TimeCalculator.init({selectors:{
		inputTime: "#time",
		inputMinute:"#minute",
		divErrors:"#error",
		divResult:"#result",
		btnCalculate:"#btnCalculate"
	}});
});