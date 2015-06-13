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

import junit.framework.Assert;
import org.junit.Ignore;
import org.junit.Test;

@Ignore
public class EllipsoidTest
{
    private static final double EPSILON = 0.000001;

    @Test
    public void testGetRadiusAt()
    {
        Ellipsoid ellipsoid = Ellipsoid.EARTH;

        double actual = ellipsoid.getRadiusAt(0.0);
        double expected = Ellipsoid.EARTH.a();

        Assert.assertEquals(expected, actual, EPSILON);
    }

    @Test
    public void testE2()
    {
        Ellipsoid ellipsoid = Ellipsoid.EARTH;

        double actual = ellipsoid.e2();
        double expected = 1.0 / 298.257223563;

        Assert.assertEquals(expected, actual, EPSILON);
    }

    @Test
    public void testCircumferenceA()
    {
        Ellipsoid ellipsoid = Ellipsoid.EARTH;

        double actual = ellipsoid.circumferenceA();
        double expected = 40075016.0;

        Assert.assertEquals(expected, actual, 1.0);
    }

    @Test
    public void testCircumferenceB()
    {
        Ellipsoid ellipsoid = Ellipsoid.EARTH;

        double actual = ellipsoid.circumferenceB();
        double expected = 39940652.0;

        Assert.assertEquals(expected, actual, 1.0);
    }
}
