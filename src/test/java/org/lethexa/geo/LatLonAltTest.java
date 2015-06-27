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
package org.lethexa.geo;

import org.junit.Assert;
import org.junit.Test;

public class LatLonAltTest {

    private final double EPSILON = 0.000001;

    @Test
    public void testValueOf() {
        LatLonAlt instance = LatLonAlt.valueOf("53.5;8.125;1000.0");

        Assert.assertEquals(53.5, instance.getLatitude(), EPSILON);
        Assert.assertEquals(8.125, instance.getLongitude(), EPSILON);
        Assert.assertEquals(1000.0, instance.getAltitude(), EPSILON);
    }

    @Test
    public void testFromGeocentric() {
        LatLonAlt instance = LatLonAlt.fromGeocentric(new double[]{6378137.0, 0.0, 0.0}, Ellipsoid.EARTH);

        Assert.assertEquals(0.0, instance.getLatitude(), EPSILON);
        Assert.assertEquals(0.0, instance.getLongitude(), EPSILON);
        Assert.assertEquals(0.0, instance.getAltitude(), EPSILON);
    }

    @Test
    public void testFromLLA() {
        LatLonAlt instance = LatLonAlt.fromLatLonAlt(53.5, 8.125, 1000.0);

        Assert.assertEquals(53.5, instance.getLatitude(), EPSILON);
        Assert.assertEquals(8.125, instance.getLongitude(), EPSILON);
        Assert.assertEquals(1000.0, instance.getAltitude(), EPSILON);
    }

    @Test
    public void testFromLLAAndEllipsoid() {
        LatLonAlt instance = LatLonAlt.fromLatLonAltAndEllipsoid(53.5, 8.125, 1000.0, Ellipsoid.EARTH);

        Assert.assertEquals(53.5, instance.getLatitude(), EPSILON);
        Assert.assertEquals(8.125, instance.getLongitude(), EPSILON);
        Assert.assertEquals(1000.0, instance.getAltitude(), EPSILON);
    }

    @Test
    public void testGetCenterWith() {
        LatLonAlt position1 = LatLonAlt.fromLatLonAlt(54.0, 8.0, 0.0);
        LatLonAlt position2 = LatLonAlt.fromLatLonAlt(53.0, 9.0, 0.0);

        LatLonAlt actual = position1.getCenterWith(position2, 10.0);
        LatLonAlt expected = LatLonAlt.fromLatLonAlt(53.5, 8.5, 10.0);

        Assert.assertEquals(expected, actual);
    }

    @Test
    public void testGetDistanceTo() {
        LatLonAlt position1 = LatLonAlt.fromLatLonAlt(54.0, 8.125, 0.0);
        LatLonAlt position2 = LatLonAlt.fromLatLonAlt(53.0, 8.125, 0.0);

        double actual = position1.getDistanceTo(position2);
        double expected = 60.0 * 1852.216;

        Assert.assertEquals(expected, actual, 1000.0); // Mittlerer Wert, deshalb nicht genau !
    }

    @Test
    public void testGetAzimutTo_1() {
        LatLonAlt position1 = LatLonAlt.fromLatLonAlt(0.0, 0.0, 0.0);
        LatLonAlt position2 = LatLonAlt.fromLatLonAlt(1.0, 0.0, 0.0);

        double actual = position1.getAzimutTo(position2);
        double expected = 0.0;

        Assert.assertEquals(expected, actual, EPSILON);
    }

    @Test
    public void testGetAzimutTo_2() {
        LatLonAlt position1 = LatLonAlt.fromLatLonAlt(0.0, 0.0, 0.0);
        LatLonAlt position2 = LatLonAlt.fromLatLonAlt(0.0, 1.0, 0.0);

        double actual = position1.getAzimutTo(position2);
        double expected = Math.toRadians(90.0);

        Assert.assertEquals(expected, actual, 0.1);
    }

    @Test
    public void testGetAzimutTo_3() {
        LatLonAlt position1 = LatLonAlt.fromLatLonAlt(0.0, 0.0, 0.0);
        LatLonAlt position2 = LatLonAlt.fromLatLonAlt(-1.0, 0.0, 0.0);

        double actual = position1.getAzimutTo(position2);
        double expected = Math.toRadians(180.0);

        Assert.assertEquals(expected, actual, EPSILON);
    }

    @Test
    public void testGetAzimutTo_4() {
        LatLonAlt position1 = LatLonAlt.fromLatLonAlt(0.0, 0.0, 0.0);
        LatLonAlt position2 = LatLonAlt.fromLatLonAlt(0.0, -1.0, 0.0);

        double actual = position1.getAzimutTo(position2);
        double expected = Math.toRadians(270.0);

        Assert.assertEquals(expected, actual, 0.1); // Mittlerer Wert, deshalb nicht genau !
    }

    @Test
    public void testToGeocentric() {
        LatLonAlt instance = LatLonAlt.fromLatLonAlt(0.0, 0.0, 0.0);

        double[] actual = instance.toGeocentric();
        double[] expected = {6378137.0, 0.0, 0.0};

        Assert.assertArrayEquals(expected, actual, EPSILON);
    }

    @Test
    public void testToLocalTransform() {
        LatLonAlt position = LatLonAlt.fromLatLonAlt(0.0, 0.0, 0.0);

        double[][] actual = position.toLocalTransform();
        double[][] expected = new double[][]{
            {-0, 1, 0},
            {-0, -0, 1},
            {1, 0, 0}
        };

        Assert.assertArrayEquals(expected[0], actual[0], EPSILON);
        Assert.assertArrayEquals(expected[1], actual[1], EPSILON);
        Assert.assertArrayEquals(expected[2], actual[2], EPSILON);
    }

    @Test
    public void testToGlobalTransform() {
        LatLonAlt position = LatLonAlt.fromLatLonAlt(0.0, 0.0, 0.0);

        double[][] actual = position.toGlobalTransform();
        double[][] expected = new double[][]{
            {-0, -0, 1},
            {1, -0, 0},
            {0, 1, 0}
        };

        Assert.assertArrayEquals(expected[0], actual[0], EPSILON);
        Assert.assertArrayEquals(expected[1], actual[1], EPSILON);
        Assert.assertArrayEquals(expected[2], actual[2], EPSILON);
    }
}
