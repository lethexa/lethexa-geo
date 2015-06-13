/*
 * Copyright (c) 2014, Tim Leerhoff <tleerhof@web.de>
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

import java.io.Serializable;

public class Ellipsoid implements Serializable
{
    public static Ellipsoid fromAxis( double a, double b )
    {
        return new Ellipsoid(a, b);
    }

    public static final Ellipsoid EARTH = new Ellipsoid(6378137.0, 6356752.3142);
    public static final Ellipsoid SUN = new Ellipsoid(1392500000.0, 1392500000.0);
    public static final Ellipsoid MERCURY = new Ellipsoid(2439640.0, 2439640.0);
    public static final Ellipsoid VENUS = new Ellipsoid(6051590.0, 6051590.0);
    public static final Ellipsoid MOON = new Ellipsoid(3476000.0, 3476000.3142);
    public static final Ellipsoid MARS = new Ellipsoid(3399200.0, 3399200.0);
    public static final Ellipsoid JUPITER = new Ellipsoid(71492680.0, 71492680.0);
    public static final Ellipsoid SATURN = new Ellipsoid(60267140.0, 60267140.0);
    public static final Ellipsoid URANUS = new Ellipsoid(25557250.0, 25557250.0);
    public static final Ellipsoid NEPTUNE = new Ellipsoid(24766360.0, 24766360.0);
    public static final Ellipsoid PLUTO = new Ellipsoid(1148070.0, 1148070.0);
    private final double a;
    private final double b;
    private final double a2;
    private final double b2;
    private final double e2;

    /**
     * Erzeugt eine Instanz dieser Klasse.
     */
    private Ellipsoid(double a, double b)
    {
        this.a = a;
        this.b = b;
        this.a2 = this.a * this.a;
        this.b2 = this.b * this.b;
        this.e2 = (this.a2 - this.b2) / this.a2;
    }

    @Override
    public final boolean equals( Object o )
    {
        if(!(o instanceof Ellipsoid))
            return false;
        
        Ellipsoid otherEllipsoid = (Ellipsoid)o;
        if( a != otherEllipsoid.a )
            return false;
        if( b != otherEllipsoid.b )
            return false;
        return true;
    }

    @Override
    public final int hashCode()
    {
        int hash = 3;
        hash = 71 * hash + (int) (Double.doubleToLongBits(this.a) ^ (Double.doubleToLongBits(this.a) >>> 32));
        hash = 71 * hash + (int) (Double.doubleToLongBits(this.b) ^ (Double.doubleToLongBits(this.b) >>> 32));
        return hash;
    }

    public final double getRadiusAt( double radLat )
    {
        double sinLat = Math.sin(radLat);
        double sinLatSquared = sinLat * sinLat;
        return a * (1.0 - e2) / Math.pow((1.0 - e2 * sinLatSquared), 1.5);
    }

    public final double a()
    {
        return a;
    }

    public final double b()
    {
        return b;
    }

    public final double a2()
    {
        return a2;
    }

    public final double b2()
    {
        return b2;
    }

    public final double e2()
    {
        return e2;
    }
}
