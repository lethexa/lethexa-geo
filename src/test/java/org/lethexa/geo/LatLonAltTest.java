/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.lethexa.geo;

import org.junit.Assert;
import org.junit.Test;

/**
 *
 * @author tim
 */
public class LatLonAltTest
{
    private final double EPSILON = 0.000001;

    @Test
    public void testValueOf()
    {
        LatLonAlt instance = LatLonAlt.valueOf("53.5;8.125;1000.0");

        Assert.assertEquals(53.5, instance.getLatitude(), EPSILON);
        Assert.assertEquals(8.125, instance.getLongitude(), EPSILON);
        Assert.assertEquals(1000.0, instance.getAltitude(), EPSILON);
    }

    @Test
    public void testFromVec3()
    {
        LatLonAlt instance = LatLonAlt.fromVec3(Vec3.fromElements(6378137.0, 0.0, 0.0), Ellipsoid.EARTH);

        Assert.assertEquals(0.0, instance.getLatitude(), EPSILON);
        Assert.assertEquals(0.0, instance.getLongitude(), EPSILON);
        Assert.assertEquals(0.0, instance.getAltitude(), EPSILON);
    }

    @Test
    public void testFromLLA()
    {
        LatLonAlt instance = LatLonAlt.fromLLA(53.5, 8.125, 1000.0);

        Assert.assertEquals(53.5, instance.getLatitude(), EPSILON);
        Assert.assertEquals(8.125, instance.getLongitude(), EPSILON);
        Assert.assertEquals(1000.0, instance.getAltitude(), EPSILON);
    }

    @Test
    public void testFromLLAAndEllipsoid()
    {
    }

    @Test
    public void testHashCode()
    {
    }

    @Test
    public void testEquals()
    {
    }

    @Test
    public void testGetLatitude()
    {
    }

    @Test
    public void testGetLongitude()
    {
    }

    @Test
    public void testGetAltitude()
    {
    }

    @Test
    public void testGetDistanceTo()
    {
    }

    @Test
    public void testGetAzimutTo()
    {
    }

    @Test
    public void testExtrapolateTo()
    {
    }

    @Test
    public void testToString()
    {
    }

}
