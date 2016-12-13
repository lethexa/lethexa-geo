/* global exports, EPSILON, DEFAULT_ELLIPSOID */

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
         * (Source: http://gis.stackexchange.com/questions/20200/how-do-you-compute-the-earths-radius-at-a-given-geodetic-latitude
         * R(f)^2 = ( a^4 cos(f)^2 + b^4 sin(f)^2 ) / ( a^2 cos(f)^2 + b^2 sin(f)^2 ).)
	 * @method getRadiusAt
	 * @param lat {Number} the latitude at the given position
	 * @return {Number} The radius in meters
	 */
        this.getRadiusAt = function (lat) {
            var a4 = a2 * a2;
            var b4 = b2 * b2;
            var radLat = lat * Math.PI / 180.0;
            var cosLat = Math.cos(radLat);
            var sinLat = Math.sin(radLat);
            var cos2Lat = cosLat * cosLat;
            var sin2Lat = sinLat * sinLat;
            return Math.sqrt((a4 * cos2Lat + b4 * sin2Lat) / (a2 * cos2Lat + b2 * sin2Lat));
        };

        /**
         * Radius at equator.
         * @method a
         * @return {Number} Radius at equator.
         */
        this.a = function () {
            return a;
        };

        /**
         * Radius at pole.
         * @method b
         * @return {Number} Radius at pole.
         */
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

    /**
     * Multiplies with a matrix with a vector.
     * @method mulMatrixVector
     * @param m {Matrix} A matrix
     * @param u {Vector} A vector
     * @return The resulting vector
     */
    var mulMatrixVector = function (m, u) {
        return [
                m[0][0] * u[0] + m[0][1] * u[1] + m[0][2] * u[2],
                m[1][0] * u[0] + m[1][1] * u[1] + m[1][2] * u[2],
                m[2][0] * u[0] + m[2][1] * u[1] + m[2][2] * u[2]
        ];
    };


    // Calculates the tangent from a point to a circle.
    var tangentFrom = function (px, py, radius) {
        var cx = 0;
        var cy = 0;
        var dx = cx - px;
        var dy = cy - py;
        var dd = Math.sqrt(dx * dx + dy * dy);
        var a = Math.asin(radius / dd);
        var b = Math.atan2(dy, dx);
        var t1 = b - a;
        var t2 = b + a;
        return {
            p1: [radius *  Math.sin(t1), radius * -Math.cos(t1)],
            p2: [radius * -Math.sin(t2), radius *  Math.cos(t2)],
            center: [-radius * Math.cos(b), radius * -Math.sin(b)],
            arclength: 2*a
        };
    };



    var DEFAULT_ELLIPSOID = exports.EARTH;
    var EPSILON = 0.001;
    var TWO_PI = 2.0 * Math.PI;
    
    var toRange0_2PI = function (x) {
        while (x >= TWO_PI)
            x -= TWO_PI;
        while (x < 0.0)
            x += TWO_PI;
        return x;
    };

    var toRangePI_PI = function (x) {
        while (x >= Math.PI)
            x -= TWO_PI;
        while (x < -Math.PI)
            x += TWO_PI;
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

        this._earthRadius = this._ellipsoid.getRadiusAt(lat);

        this._sinLat = Math.sin(this._radLat);
        this._cosLat = Math.cos(this._radLat);
        this._sinLon = Math.sin(this._radLon);
        this._cosLon = Math.cos(this._radLon);
    };

    exports.LatLonAlt.prototype.getRadius = function () {
        return this._earthRadius;
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

    /**
     * Calculates the distance from this position to the tangent point on planet surface.
     * @method getMeanTangentDistance
     * @return The distance to the horizon.
     */
    exports.LatLonAlt.prototype.getDistanceToHorizon = function() {
        var geocentric = this.toVec3();
        var earthRadius2 = this._earthRadius * this._earthRadius;
        var x = geocentric[0];
        var y = geocentric[1];
        var z = geocentric[2];
        
         // projected to 2d.
        var viewerX = Math.sqrt(x*x+y*y);
        var viewerY = z;
        var viewerDistFromCenterSquared = viewerX * viewerX + viewerY * viewerY;
        
        if(viewerDistFromCenterSquared < earthRadius2)
            return undefined;
        var tangent = tangentFrom(viewerX, viewerY, this._earthRadius);
        if(tangent === undefined)
            return undefined;
        
        var diffX = viewerX - tangent.p1[0];
        var diffY = viewerY - tangent.p1[1];
        var distToTangentPoint = Math.sqrt(diffX * diffX + diffY * diffY);
        return distToTangentPoint;
    };

    /**
     * Calculates the altitude a target should have to be seen over the horizon at
     * the specified distance.
     * @method getAltitudeAboveHorizon
     * @param distance {Number} The distance of the target.
     * @return The altitude to NN and the distance of the horizon.
     */
    exports.LatLonAlt.prototype.getAltitudeAboveHorizon = function (distance) {
        var planetRadius = this._earthRadius;
        var planetRadius2 = planetRadius * planetRadius;
        var alt = this._alt;
        var alt2 = alt * alt;
        
        var d1 = Math.sqrt(alt2 + 2.0 * planetRadius * alt);
        var d0 = distance - d1;
        var h1 = Math.sqrt(d0 * d0 + planetRadius2) - planetRadius;
        
        if(distance < d1)
            h1 = 0.0;
        return { 
            altitude: h1, 
            distance: d1
        };
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

    exports.LatLonAlt.prototype.getElevationTo = function (to) {
        var relpos = this.toRelativeVec3(to);
        var distXY = Math.sqrt(relpos[0] * relpos[0] + relpos[1] * relpos[1]);
        var elevation = -Math.atan2(relpos[2], distXY);
        return toRangePI_PI(elevation);
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

    exports.LatLonAlt.prototype.toRelativeVec3 = function (lla) {
        var v1 = this.toVec3();
        var v2 = lla.toVec3();
        var diff = [
            v2[0] - v1[0],
            v2[1] - v1[1],
            v2[2] - v1[2]
        ];
        var toLocal = this.toLocalTransform();
        var relPosition = mulMatrixVector(toLocal, diff);
        return relPosition;
    };

    exports.LatLonAlt.prototype.fromRelativeVec3 = function (vec) {
        var v = this.toVec3();
        var toGlobal = this.toGlobalTransform();
        var relpos = mulMatrixVector(toGlobal, vec);
        return exports.fromVec3([
            relpos[0] + v[0],
            relpos[1] + v[1],
            relpos[2] + v[2]
        ]);
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


    var fillLeadingZeros = function(value, num) {
        var result = '' + value;
        var factor = Math.pow(10, num-1);
        if(num <= 1)
            return result;
        while(factor !== 1) {
            result = (value < factor ? '0': '') + result;
            factor /= 10;
        }
        return result;
    };

    var fracValue = function(value, fracs) {
        var factor = Math.pow(10, fracs);
        return Math.floor(value * factor) / factor;
    };

    var cvtToDegMinSec = function(value) {
        var rest;
        var floored;
        value = Math.abs(value);
        
        floored = Math.floor(value);        
        var deg = floored;
        
        rest = value - floored;
        value = rest * 60.0;
        floored = Math.floor(value);
        var min = floored;
        
        rest = value - floored;
        value = rest * 60.0;
        floored = Math.floor(value);
        var sec = value;
        
        return {deg: deg, min: min, sec: sec };
    };

    exports.cvtLatitudeToDegMinSec = function(lat) {
        var latValues = cvtToDegMinSec(Math.abs(lat));
        var asString = '';
        asString += fillLeadingZeros(latValues.deg, 2) + '° ';
        asString += fillLeadingZeros(latValues.min, 2) + "' ";
        asString += fillLeadingZeros(fracValue(latValues.sec, 2), 2) + "''";
        if(lat >= 0.0)
            return asString + ' N';
        else
            return asString + ' S';
    };

    exports.cvtLongitudeToDegMinSec = function(lon) {
        var lonValues = cvtToDegMinSec(Math.abs(lon));
        var asString = '';
        asString += fillLeadingZeros(lonValues.deg, 3) + '° ';
        asString += fillLeadingZeros(lonValues.min, 2) + "' ";
        asString += fillLeadingZeros(fracValue(lonValues.sec, 2), 2) + "''";
        if(lon >= 0.0)
            return asString + ' E';
        else
            return asString + ' W';
    };    

    exports.cvtLatitudeToDecimalDegrees = function(lat, frac) {
        if(frac === undefined)
            throw Error('frac is missing');
        var asString = fracValue(Math.abs(lat), frac) + "°";
        if(lat >= 0.0)
            return asString + ' N';
        else
            return asString + ' S';
    };    

    exports.cvtLongitudeToDecimalDegrees = function(lon, frac) {
        if(frac === undefined)
            throw Error('frac is missing');
        var asString = fracValue(Math.abs(lon), frac) + "°";
        if(lon >= 0.0)
            return asString + ' E';
        else
            return asString + ' W';
    };    
})(typeof exports === 'undefined' ? this.geo = {} : exports);

