var assert = require("assert");
var geo = require("../../main/js/geo.js");


describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
});



describe('Ellipsoid', function () {
    describe('#a()', function () {
        it('should return semimajor earthradius when earth selected', function () {
            var earthEllipsoid = geo.EARTH;

            assert.equal(earthEllipsoid.a(), 6378137.0);
        });
    });

    describe('#b()', function () {
        it('should return semiminor earthradius when earth selected', function () {
            var earthEllipsoid = geo.EARTH;

            assert.equal(earthEllipsoid.b(), 6356752.3142);
        });
    });
});



describe('LatLonAlt', function () {
    describe('#getLatitude()', function () {
        it('should return latitude earthradius when getLatitude called', function () {
            var geoPos = new geo.LatLonAlt(53.5, 8.125, 1000.0);

            assert.equal(geoPos.getLatitude(), 53.5);
        });
    });

    describe('#getLongitude()', function () {
        it('should return longitude earthradius when getLongitude called', function () {
            var geoPos = new geo.LatLonAlt(53.5, 8.125, 1000.0);

            assert.equal(geoPos.getLongitude(), 8.125);
        });
    });
    
    describe('#getAltitude()', function () {
        it('should return altitude earthradius when getAltitude called', function () {
            var geoPos = new geo.LatLonAlt(53.5, 8.125, 1000.0);

            assert.equal(geoPos.getAltitude(), 1000.0);
        });
    });
    
    describe('#getDistanceTo()', function () {
        it('should return distance earthradius when getDistanceTo called', function () {
            var geoPos1 = new geo.LatLonAlt(54.0, 8.125, 0.0);
            var geoPos2 = new geo.LatLonAlt(53.0, 8.125, 0.0);

            var distance = geoPos1.getDistanceTo(geoPos2);

            assert.equal(Math.floor(distance), 111305.0);
        });
    });
});
