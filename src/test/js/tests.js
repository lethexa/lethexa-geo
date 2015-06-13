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
        it('should return latitude when getLatitude called', function () {
            var geoPos = new geo.LatLonAlt(53.5, 8.125, 1000.0);

            assert.equal(geoPos.getLatitude(), 53.5);
        });
    });

    describe('#getLongitude()', function () {
        it('should return longitude when getLongitude called', function () {
            var geoPos = new geo.LatLonAlt(53.5, 8.125, 1000.0);

            assert.equal(geoPos.getLongitude(), 8.125);
        });
    });
    
    describe('#getAltitude()', function () {
        it('should return altitude when getAltitude called', function () {
            var geoPos = new geo.LatLonAlt(53.5, 8.125, 1000.0);

            assert.equal(geoPos.getAltitude(), 1000.0);
        });
    });
    
    describe('#getDistanceTo()', function () {
        it('should return distance when getDistanceTo called', function () {
            var position1 = new geo.LatLonAlt(54.0, 8.125, 0.0);
            var position2 = new geo.LatLonAlt(53.0, 8.125, 0.0);

            var actual = position1.getDistanceTo(position2);
            var expected = 111305.0;

            assert.equal(Math.floor(actual), expected);
        });
    });

    describe('#getAzimutTo()', function () {
        it('should return azimut=0 when two points given 0°', function () {
            var position1 = new geo.LatLonAlt(53.0, 8.125, 0.0);
            var position2 = new geo.LatLonAlt(54.0, 8.125, 0.0);

            var actual = position1.getAzimutTo(position2) * 180.0 / Math.PI;
            var expected = 0.0; 

            assert.equal(Math.round(actual), expected);
        });
    });

    describe('#getAzimutTo()', function () {
        it('should return azimut=90 when two points given 90°', function () {
            var position1 = new geo.LatLonAlt(54.0, 8.125, 0.0);
            var position2 = new geo.LatLonAlt(54.0, 9.125, 0.0);

            var actual = position1.getAzimutTo(position2) * 180.0 / Math.PI;
            var expected = 90.0; 

            assert.equal(Math.round(actual), expected);
        });
    });

    describe('#getAzimutTo()', function () {
        it('should return azimut=180 when two points given 180°', function () {
            var position1 = new geo.LatLonAlt(54.0, 8.125, 0.0);
            var position2 = new geo.LatLonAlt(53.0, 8.125, 0.0);

            var actual = position1.getAzimutTo(position2) * 180.0 / Math.PI;
            var expected = 180.0; 

            assert.equal(Math.round(actual), expected);
        });
    });

    describe('#getAzimutTo()', function () {
        it('should return azimut=270 when two points given 270°', function () {
            var position1 = new geo.LatLonAlt(54.0, 8.125, 0.0);
            var position2 = new geo.LatLonAlt(54.0, 7.125, 0.0);

            var actual = position1.getAzimutTo(position2) * 180.0 / Math.PI;
            var expected = 270.0; 

            assert.equal(Math.round(actual), expected);
        });
    });
});
