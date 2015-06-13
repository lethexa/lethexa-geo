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
});
