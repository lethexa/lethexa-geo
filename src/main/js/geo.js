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

        var EPSILON = 0.001;

        ellipsoid = ellipsoid || exports.LatLonAlt.DEFAULT_ELLIPSOID;
        var radLat = lat * Math.PI / 180.0;
        var radLon = lon * Math.PI / 180.0;

        var earthRadius = ellipsoid.getRadiusAt(radLat);

        var sinLat = Math.sin(radLat);
        var cosLat = Math.cos(radLat);
        var sinLon = Math.sin(radLon);
        var cosLon = Math.cos(radLon);

        this.getLatitude = function () {
            return lat;
        };

        this.getLongitude = function () {
            return lon;
        };

        this.getAltitude = function () {
            return alt;
        };

    };


})(typeof exports === 'undefined' ? this.geo = {} : exports);

