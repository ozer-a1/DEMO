DEMO
====
Sample node.js time calculator w/out using any DateTime libraries.

Live demo is available at : http://oudemo.azurewebsites.net/

DESCRIPTION
====
Project Layout
 - Index Page
	Simple user interface

 - Time.js : 
	Client side helper and validator. Formats input as user enters it realtime.

 - Json / Rest Api : 
	/api/time - POST 
			
		Accepts : 
			{time": "12:59 AM", "minutes": "1"}
			
		Returns : 
			response to valid input:
				{
					"errors": [],
					"result": "01:00 AM"
				}
			response to invalid input:
				{
					"errors": [
					"Invalid time format. Time must be in [H]H:MM (A|P)M format.",
					"You must provide minutes to add"
					],
					"result": null
				}




TODO
====
	- Add server side exception handling and logging module 
	- CI / Unit tests
	- Resource minification on build