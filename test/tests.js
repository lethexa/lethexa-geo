var assert = require("assert");
//var geo = require("../lib/geo.js");
var geo = require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../lib/') + 'geo.js');


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

    describe('#getCenterWith()', function () {
        it('should return altitude when getAltitude called', function () {
            var geoPos1 = new geo.LatLonAlt(53.0, 8.0, 0.0);
            var geoPos2 = new geo.LatLonAlt(54.0, 9.0, 0.0);

            var actual = geoPos1.getCenterWith(geoPos2, 10.0);
            var expected = new geo.LatLonAlt(53.5, 8.5, 10.0);

            assert.equal(actual.getLatitude(), expected.getLatitude(), 0.0001);
            assert.equal(actual.getLongitude(), expected.getLongitude(), 0.0001);
            assert.equal(actual.getAltitude(), expected.getAltitude());
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
            var position1 = new geo.LatLonAlt(0.0, 0.0, 0.0);
            var position2 = new geo.LatLonAlt(0.0, 0.0, 0.0);

            var actual = position1.getAzimutTo(position2) * 180.0 / Math.PI;
            var expected = 0.0;

            assert.equal(Math.round(actual), expected);
        });
    });

    describe('#getAzimutTo()', function () {
        it('should return azimut=90 when two points given 90°', function () {
            var position1 = new geo.LatLonAlt(0.0, 0.0, 0.0);
            var position2 = new geo.LatLonAlt(0.0, 1.0, 0.0);

            var actual = position1.getAzimutTo(position2) * 180.0 / Math.PI;
            var expected = 90.0;

            assert.equal(Math.round(actual), expected);
        });
    });

    describe('#getAzimutTo()', function () {
        it('should return azimut=180 when two points given 180°', function () {
            var position1 = new geo.LatLonAlt(0.0, 0.0, 0.0);
            var position2 = new geo.LatLonAlt(-1.0, 0.0, 0.0);

            var actual = position1.getAzimutTo(position2) * 180.0 / Math.PI;
            var expected = 180.0;

            assert.equal(Math.round(actual), expected);
        });
    });

    describe('#getAzimutTo()', function () {
        it('should return azimut=270 when two points given 270°', function () {
            var position1 = new geo.LatLonAlt(0.0, 0.0, 0.0);
            var position2 = new geo.LatLonAlt(0.0, -1.0, 0.0);

            var actual = position1.getAzimutTo(position2) * 180.0 / Math.PI;
            var expected = 270.0;

            assert.equal(Math.round(actual), expected);
        });
    });

    describe('#toVec3', function () {
        it('should return Vector when the position given', function () {
            var position = new geo.LatLonAlt(0.0, 0.0, 0.0);

            var actual = position.toVec3();
            var expected = [6378137.0, 0.0, 0.0];

            assert.equal(actual[0], expected[0]);
            assert.equal(actual[1], expected[1]);
            assert.equal(actual[2], expected[2]);
        });
    });

    describe('#fromVec3', function () {
        it('should return LatLonAlt when the position given', function () {
            var vec = [6378137.0, 0.0, 0.0];

            var actual = geo.fromVec3(vec);
            var expected = new geo.LatLonAlt(0.0, 0.0, 0.0);

            assert.equal(actual.getLatitude(), expected.getLatitude());
            assert.equal(actual.getLongitude(), expected.getLongitude());
            assert.equal(actual.getAltitude(), expected.getAltitude());
        });
    });

    describe('#toLocalTransform', function () {
        it('should return a correct transformmatrix 3x3 when the position given', function () {
            var position = new geo.LatLonAlt(0.0, 0.0, 0.0);

            var actual = position.toLocalTransform();
            var expected = [
                [-0, 1, 0],
                [-0, -0, 1],
                [1, 0, 0]
            ];

            assert.equal(actual[0][0], expected[0][0]);
            assert.equal(actual[0][1], expected[0][1]);
            assert.equal(actual[0][2], expected[0][2]);

            assert.equal(actual[1][0], expected[1][0]);
            assert.equal(actual[1][1], expected[1][1]);
            assert.equal(actual[1][2], expected[1][2]);

            assert.equal(actual[2][0], expected[2][0]);
            assert.equal(actual[2][1], expected[2][1]);
            assert.equal(actual[2][2], expected[2][2]);
        });
    });

    describe('#toGlobalTransform', function () {
        it('should return a correct transformmatrix 3x3 when the position given', function () {
            var position = new geo.LatLonAlt(0.0, 0.0, 0.0);

            var actual = position.toGlobalTransform();
            var expected = [
                [-0, -0, 1],
                [1, -0, 0],
                [0, 1, 0]
            ];

            assert.equal(actual[0][0], expected[0][0]);
            assert.equal(actual[0][1], expected[0][1]);
            assert.equal(actual[0][2], expected[0][2]);

            assert.equal(actual[1][0], expected[1][0]);
            assert.equal(actual[1][1], expected[1][1]);
            assert.equal(actual[1][2], expected[1][2]);

            assert.equal(actual[2][0], expected[2][0]);
            assert.equal(actual[2][1], expected[2][1]);
            assert.equal(actual[2][2], expected[2][2]);
        });
    });

    describe('#extrapolateVector', function () {
        it('should return an extrapolated position', function () {
            var position = new geo.LatLonAlt(53.0, 8.0, 0.0);

            var actual = position.extrapolateVector(0.0, 111000.0, 10.0);
            var expected = new geo.LatLonAlt(54.0, 8.0, 10.0);

            assert.equal(Math.round(actual.getLatitude()), expected.getLatitude());
            assert.equal(actual.getLongitude(), expected.getLongitude());
            assert.equal(actual.getAltitude(), expected.getAltitude());
        });
    });

    describe('#extrapolateVector', function () {
        it('should return an extrapolated position', function () {
            var position = new geo.LatLonAlt(0.0, 0.0, 0.0);

            var actual = position.extrapolateVector(111000.0, 111000.0, 10.0);
            var expected = new geo.LatLonAlt(1.0, 1.0, 10.0);

            assert.equal(Math.round(actual.getLatitude()), expected.getLatitude());
            assert.equal(Math.round(actual.getLongitude()), expected.getLongitude());
            assert.equal(actual.getAltitude(), expected.getAltitude());
        });
    });

    describe('#extrapolatePolar', function () {
        it('should return an extrapolated position', function () {
            var position = new geo.LatLonAlt(53.0, 8.0, 0.0);

            var actual = position.extrapolatePolar(111000.0, 0.0);
            var expected = new geo.LatLonAlt(54.0, 8.0, 0.0);

            assert.equal(Math.round(actual.getLatitude()), expected.getLatitude());
            assert.equal(actual.getLongitude(), expected.getLongitude());
            assert.equal(actual.getAltitude(), expected.getAltitude());
        });
    });

    describe('#extrapolatePolar', function () {
        it('should return an extrapolated position', function () {
            var position = new geo.LatLonAlt(0.0, 0.0, 0.0);

            var actual = position.extrapolatePolar(111000.0, Math.PI / 2.0);
            var expected = new geo.LatLonAlt(0.0, 1.0, 0.0);

            assert.equal(Math.round(actual.getLatitude()), expected.getLatitude());
            assert.equal(Math.round(actual.getLongitude()), expected.getLongitude());
            assert.equal(actual.getAltitude(), expected.getAltitude());
        });
    });
});




describe('cvtLatitudeToDegMinSec', function () {
    it("should return the string 53° 30' 00'' N for position 53.5", function () {
        assert.equal(geo.cvtLatitudeToDegMinSec(53.5), "53° 30' 00'' N");
    });
});


describe('cvtLongitudeToDegMinSec', function () {
    it("should return the string 008° 30' 00'' N for position 8.125", function () {
        assert.equal(geo.cvtLongitudeToDegMinSec(8.125), "008° 07' 30'' E");
    });
});
