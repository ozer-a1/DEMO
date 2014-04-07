
/*
 * Time Calculation API 
 */
exports.calculate = function (req, res) {
	var errors = [];

	var time = req.body.time;
	var minutes = req.body.minutes;
	var result = null;

	if (time == undefined)
		errors.push(messages.missingTime);

	if (time != undefined && !validateTime(time))
		errors.push(messages.invalidTimeFormat);

	if (minutes == undefined)
		errors.push(messages.missingMinutes);

	if (minutes != undefined && !isNumber(minutes))
		errors.push(messages.minutesNonNumeric);
	else
		minutes = minutes * 1


	if (errors.length > 0) {
		res.statusCode = 400; // bad request
		result = validateTime(time);

		res.send({ 
			errors: errors, 
			result: result
		});
	} else {

		var arrTime = [];
		try {
			arrTime = parseTime(time);
			result = addTime(arrTime[0], arrTime[1], arrTime[2], minutes);
		}
		catch (ex) {
			errors = ex;
		}
		
		res.send({ 
			errors: errors, 
			result: result
		});
		
	}

};

var messages = {
	missingTime : 'You must provide the time.',
	missingMinutes : 'You must provide minutes to add',
	minutesNonNumeric: 'Minutes must be numeric.',
	invalidTimeFormat : 'Invalid time format. Time must be in [H]H:MM (A|P)M format.'
};

var isNumber = function(n) 
{
	if ( n == ''){return true;}
	return !isNaN(parseFloat(n)) && isFinite(n);
};

var timePattern = /(\d+):(\d{2})\s([APap][Mm])/g;

var validateTime = function (data) {
	if (data == undefined || data == null)
		return null;
	var result = data.match(timePattern);
	return result;
};

/*split hh:mm am/pm and return as array*/
var parseTime = function (data) {
	var time = [];
	var hhmm_ampm = data.split(":");
	time.push(hhmm_ampm[0] * 1);
	var mm_ampm = hhmm_ampm[1].split(" ");
	time.push(mm_ampm[0] *1 );
	time.push(mm_ampm[1]);
	return time;
}

var addTime = function (hh, mm, ampm, minutesToAdd) {

	
	var timeInMinutes = 0;
	var minutesToAdd = minutesToAdd % 1440; // minutes to add larger than a day...

	if (hh == 12) // 12 am is 00 in 24hr
		hh = 0;

	if (ampm.toLowerCase() == 'pm') // pm is +12 hrs
		hh = hh * 1 + 12;

	timeInMinutes = hh * 60 + mm + minutesToAdd; // convert hrs to minutes and add the value

	if (timeInMinutes < 0) { // handle negative 
		timeInMinutes = 1440 + timeInMinutes;
	}

	// convert to hrs and minutes
	minutes = timeInMinutes % 60;
	hrs = (timeInMinutes - minutes) / 60;

	hrs = hrs % 24;

	// calcualte am or pm 
	if (hrs <= 11) {
		ampm = 'AM'
	} else {
		ampm = 'PM'
		hrs = hrs % 12; // convert to 12 hr format
	}

	if (hrs == 0) // 0 is 12 midnight
		hrs += 12;

	// pad w/ leading 0
	if (hrs < 10) 
		hrs = '0' + hrs

	if (minutes < 10)
		minutes = '0' + minutes
	
	// format 
	return hrs + ':' + minutes + ' ' + ampm;

}
