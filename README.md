Installation
------------

	npm install
	grunt

Usage
-----

	var geo = require('lethexa-geo');

	var llPoint1 = new geo.LatLonAlt(lat, lon, alt);
	var llPoint2 = new geo.LatLonAlt(lat, lon, alt, geo.EARTH);

	var distance = llPoint1.getDistanceTo(llPoint2);

	console.log(distance);

