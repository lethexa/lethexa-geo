/*
 * Copyright (c) 2015, Tim Leerhoff <tleerhof@web.de>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/* global exports */

(function (exports) {
    'use strict';

    exports.Ellipsoid = function (a, b) {
        var a2 = a * a;
        var b2 = b * b;
        var e2 = (a2 - b2) / a2;

        this.getRadiusAt = function (radLat) {
            var sinLat = Math.sin(radLat);
            var sinLatSquared = sinLat * sinLat;
            return a * (1.0 - e2) / Math.pow((1.0 - e2 * sinLatSquared), 1.5);
        };

        this.a = function () {
            return a;
        };

        this.b = function () {
            return b;
        };

        this.a2 = function () {
            return a2;
        };

        this.b2 = function () {
            return b2;
        };

        this.e2 = function () {
            return e2;
        };

        this.circumferenceA = function () {
            return 2.0 * Math.PI * this.a;
        };

        this.circumferenceB = function () {
            return 2.0 * Math.PI * this.b;
        };
    };

    exports.EARTH = new exports.Ellipsoid(6378137.0, 6356752.3142);
    exports.SUN = new exports.Ellipsoid(1392500000.0, 1392500000.0);
    exports.MERCURY = new exports.Ellipsoid(2439640.0, 2439640.0);
    exports.VENUS = new exports.Ellipsoid(6051590.0, 6051590.0);
    exports.MOON = new exports.Ellipsoid(3476000.0, 3476000.3142);
    exports.MARS = new exports.Ellipsoid(3399200.0, 3399200.0);
    exports.JUPITER = new exports.Ellipsoid(71492680.0, 71492680.0);
    exports.SATURN = new exports.Ellipsoid(60267140.0, 60267140.0);
    exports.URANUS = new exports.Ellipsoid(25557250.0, 25557250.0);
    exports.NEPTUNE = new exports.Ellipsoid(24766360.0, 24766360.0);
    exports.PLUTO = new exports.Ellipsoid(1148070.0, 1148070.0);




    exports.LatLonAlt = function (lat, lon, alt, ellipsoid) {
        exports.LatLonAlt.DEFAULT_ELLIPSOID = exports.EARTH;
        exports.LatLonAlt.EPSILON = 0.001;

        this._ellipsoid = ellipsoid || exports.LatLonAlt.DEFAULT_ELLIPSOID;
        this._lat = lat;
        this._lon = lon;
        this._alt = alt;
        
        this._radLat = lat * Math.PI / 180.0;
        this._radLon = lon * Math.PI / 180.0;

        this._earthRadius = this._ellipsoid.getRadiusAt(this._radLat);

        this._sinLat = Math.sin(this._radLat);
        this._cosLat = Math.cos(this._radLat);
        this._sinLon = Math.sin(this._radLon);
        this._cosLon = Math.cos(this._radLon);
    };

    exports.LatLonAlt.prototype.getLatitude = function () {
        return this._lat;
    };

    exports.LatLonAlt.prototype.getLongitude = function () {
        return this._lon;
    };

    exports.LatLonAlt.prototype.getAltitude = function () {
        return this._alt;
    };

    exports.LatLonAlt.prototype.getDistanceTo = function(to) {
        var latDiff = Math.abs(to._radLat - this._radLat);
        var lonDiff = Math.abs(to._radLon - this._radLon);

        var sin2LatDiff = Math.sin(latDiff / 2.0);
        var sin2LonDiff = Math.sin(lonDiff / 2.0);

        var a = sin2LatDiff * sin2LatDiff + this._cosLat * to._cosLat * sin2LonDiff * sin2LonDiff;
        var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
        return this._earthRadius * c;
    };


})(typeof exports === 'undefined' ? this.geo = {} : exports);

