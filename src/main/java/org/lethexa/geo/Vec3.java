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

/**
 * This class is immutable
 */
public class Vec3
{
    public static final Vec3 UNIT_X = new Vec3(1.0, 0.0, 0.0);
    public static final Vec3 UNIT_Y = new Vec3(0.0, 1.0, 0.0);
    public static final Vec3 UNIT_Z = new Vec3(0.0, 0.0, 1.0);
    public static final Vec3 NULL = new Vec3(0.0, 0.0, 0.0);

    private final double x;
    private final double y;
    private final double z;

    public static Vec3 valueOf( String value )
    {
        String[] parts = value.split(";");
        if( parts.length != 3 )
            throw new IllegalArgumentException("Invalid string: " + value);
        double x = Double.parseDouble(parts[0]);
        double y = Double.parseDouble(parts[1]);
        double z = Double.parseDouble(parts[2]);
        return fromElements(x, y, z);
    }

    public static Vec3 fromPolar( double pitch, double yaw, double distance )
    {
        double cosPitchDist = distance * Math.cos(pitch);
        double sinPitchDist = -distance * Math.sin(pitch);

        return new Vec3(
                cosPitchDist * Math.cos(yaw),
                cosPitchDist * Math.sin(yaw),
                sinPitchDist);
    }

    public static Vec3 fromArray( double[] a )
    {
        return new Vec3(a[0], a[1], a[2]);
    }

    public static Vec3 fromElements( double x, double y, double z )
    {
        return new Vec3(x, y, z);
    }

    private Vec3( double x, double y, double z )
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    @Override
    public int hashCode()
    {
        int hash = 3;
        hash = 13 * hash + (int) (Double.doubleToLongBits(this.x) ^ (Double.doubleToLongBits(this.x) >>> 32));
        hash = 13 * hash + (int) (Double.doubleToLongBits(this.y) ^ (Double.doubleToLongBits(this.y) >>> 32));
        hash = 13 * hash + (int) (Double.doubleToLongBits(this.z) ^ (Double.doubleToLongBits(this.z) >>> 32));
        return hash;
    }

    @Override
    public boolean equals( Object obj )
    {
        if( obj == null )
            return false;
        if( getClass() != obj.getClass() )
            return false;
        final Vec3 other = (Vec3) obj;
        if( Double.doubleToLongBits(this.x) != Double.doubleToLongBits(other.x) )
            return false;
        if( Double.doubleToLongBits(this.y) != Double.doubleToLongBits(other.y) )
            return false;
        if( Double.doubleToLongBits(this.z) != Double.doubleToLongBits(other.z) )
            return false;
        return true;
    }

    public double x()
    {
        return this.x;
    }

    public double y()
    {
        return this.y;
    }

    public double z()
    {
        return this.z;
    }

    @Override
    public String toString()
    {
        return "" + x + ";" + y + ";" + z;
    }
}
