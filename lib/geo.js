/* global exports */

(function (exports) {
    'use strict';

    /**
     * Class representing an ellipsoid
     * @class Ellipsoid
     * @constructor
     * @param a The semi-major-axis
     * @param b The semi-minor-axis
     */
    exports.Ellipsoid = function (a, b) {
        var a2 = a * a;
        var b2 = b * b;
        var e2 = (a2 - b2) / a2;

	/**
	 * Calculates the radius at the given getLatitude
	 * @method getRadiusAt
	 * @param radLat {Number} the latitude in radians at the given position
	 * @return {Number} The radius in meters
	 */
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



    var DEFAULT_ELLIPSOID = exports.EARTH;
    var EPSILON = 0.001;
    var toRange0_2PI = function (x) {
        var twoPI = 2.0 * Math.PI;
        while (x >= twoPI)
            x -= twoPI;
        while (x < 0.0)
            x += twoPI;
        return x;
    };

    var transposeMatrix3x3 = function (m) {
        return [
            [m[0][0], m[1][0], m[2][0]],
            [m[0][1], m[1][1], m[2][1]],
            [m[0][2], m[1][2], m[2][2]]
        ];
    };

    exports.LatLonAlt = function (lat, lon, alt, ellipsoid) {
        this._ellipsoid = ellipsoid || DEFAULT_ELLIPSOID;
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

    exports.LatLonAlt.prototype.getCenterWith = function (p2, altitude) {
        var centerLat = (this.getLatitude() + p2.getLatitude()) / 2.0;
        var centerLon = (this.getLongitude() + p2.getLongitude()) / 2.0;
        return new exports.LatLonAlt(
                centerLat,
                centerLon,
                altitude,
                this._ellipsoid
        );
    };

    exports.LatLonAlt.prototype.extrapolateVector = function (x, y, z) {
        var angleLat = y / (this._ellipsoid.a());
        var angleLon = x / (this._cosLat * this._ellipsoid.b());
        return new exports.LatLonAlt(
                this.getLatitude() + angleLat * 180.0 / Math.PI,
                this.getLongitude() + angleLon * 180.0 / Math.PI,
                this.getAltitude() + z,
                this._ellipsoid
                );
    };

    exports.LatLonAlt.prototype.extrapolatePolar = function (distance, azimut) {
        if (distance < 0.0) {
            throw new Error("distance should be >= 0.0, but is " + distance);
        }

        var arcOnSurface = distance / this._earthRadius;
        var cosAzimut = Math.cos(azimut);
        var sinAzimut = Math.sin(azimut);
        var sinArcOnSurface = Math.sin(arcOnSurface);
        var cosArcOnSurface = Math.cos(arcOnSurface);

        var newLat = Math.asin(this._sinLat * cosArcOnSurface + this._cosLat * sinArcOnSurface * cosAzimut);
        var newLon = Math.atan2(sinArcOnSurface * sinAzimut, this._cosLat * cosArcOnSurface - this._sinLat * sinArcOnSurface * cosAzimut) + this._radLon;

        return new exports.LatLonAlt(
                newLat * 180.0 / Math.PI,
                newLon * 180.0 / Math.PI,
                this._alt,
                this._ellipsoid
                );
    };

    exports.LatLonAlt.prototype.getDistanceTo = function (to) {
        var latDiff = Math.abs(to._radLat - this._radLat);
        var lonDiff = Math.abs(to._radLon - this._radLon);

        var sin2LatDiff = Math.sin(latDiff / 2.0);
        var sin2LonDiff = Math.sin(lonDiff / 2.0);

        var a = sin2LatDiff * sin2LatDiff + this._cosLat * to._cosLat * sin2LonDiff * sin2LonDiff;
        var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
        return this._earthRadius * c;
    };


    exports.LatLonAlt.prototype.getAzimutTo = function (to) {
        var lonDiff = to._radLon - this._radLon;
        var sinLonDiff = Math.sin(lonDiff);
        var cosLonDiff = Math.cos(lonDiff);
        var azimut = Math.atan2(to._cosLat * sinLonDiff, (this._cosLat * to._sinLat - this._sinLat * to._cosLat * cosLonDiff));
        return toRange0_2PI(azimut);
    };

    exports.LatLonAlt.prototype.toLocalTransform = function () {
        return [
            [-this._sinLon, this._cosLon, 0.0],
            [-this._sinLat * this._cosLon, -this._sinLat * this._sinLon, this._cosLat],
            [this._cosLat * this._cosLon, this._cosLat * this._sinLon, this._sinLat]
        ];
    };

    exports.LatLonAlt.prototype.toGlobalTransform = function () {
        return transposeMatrix3x3(this.toLocalTransform());
    };

    exports.LatLonAlt.prototype.toVec3 = function () {
        var V = this._ellipsoid.a() / Math.sqrt(1.0 - this._ellipsoid.e2() * this._sinLat * this._sinLat);

        var x = (V + this._alt) * this._cosLat * this._cosLon;
        var y = (V + this._alt) * this._cosLat * this._sinLon;
        var z = ((1.0 - this._ellipsoid.e2()) * V + this._alt) * this._sinLat;

        return [x, y, z];
    };

    exports.fromVec3 = function (vec, ellipsoid) {
        var theEllipsoid = ellipsoid || DEFAULT_ELLIPSOID;
        var x = vec[0];
        var y = vec[1];
        var z = vec[2];

        var radTempLat = 0.0;
        var radTempLon = Math.atan2(y, x);
        var alt = 0.0;
        var xy = Math.sqrt(x * x + y * y);
        var dOldLat, dOldAlt;
        var sinTempLat = Math.sin(radTempLat);
        var cosTempLat = Math.cos(radTempLat);
        var dV;
        do
        {
            dOldLat = radTempLat;
            dOldAlt = alt;

            dV = theEllipsoid.a() / Math.sqrt(1.0 - theEllipsoid.e2() * sinTempLat * sinTempLat);
            radTempLat = Math.atan((z - alt * theEllipsoid.e2() * sinTempLat) / (xy * (1.0 - theEllipsoid.e2())));

            sinTempLat = Math.sin(radTempLat);
            cosTempLat = Math.cos(radTempLat);

            alt = xy / cosTempLat - dV;
        }
        while (Math.abs(dOldLat - radTempLat) > EPSILON || Math.abs(dOldAlt - alt) > EPSILON);

        return new exports.LatLonAlt(
                radTempLat * 180.0 / Math.PI,
                radTempLon * 180.0 / Math.PI,
                alt,
                theEllipsoid
                );
    };

    exports.LatLonAlt.prototype.toString = function() {
      return '' + this._lat + '°, ' + this._lon + '°, ' + this._alt + 'm';
    };

})(typeof exports === 'undefined' ? this.geo = {} : exports);

