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
public class LatLonAlt
{
    private final Ellipsoid ellipsoid;
    private final double lat;
    private final double lon;
    private final double alt;

    private final double earthRadius;

    private final double radLat;
    private final double radLon;

    private final double sinLat;
    private final double cosLat;
    private final double sinLon;
    private final double cosLon;

    public static LatLonAlt valueOf( String value )
    {
        String[] parts = value.split(";");
        if( parts.length != 3 )
            throw new IllegalArgumentException("Invalid string: " + value);
        return fromLLA(
                Double.parseDouble(parts[0]),
                Double.parseDouble(parts[1]),
                Double.parseDouble(parts[2])
        );
    }

    public static LatLonAlt fromLLA( double lat, double lon, double alt )
    {
        return new LatLonAlt(lat, lon, alt, Ellipsoid.EARTH);
    }

    public static LatLonAlt fromLLAAndEllipsoid( double lat, double lon, double alt, Ellipsoid ellipsoid )
    {
        return new LatLonAlt(lat, lon, alt, ellipsoid);
    }

    private LatLonAlt( double lat, double lon, double alt, Ellipsoid ellipsoid )
    {
        this.lat = lat;
        this.lon = lon;
        this.alt = alt;
        this.ellipsoid = ellipsoid;

        this.radLat = Math.toRadians(this.lat);
        this.radLon = Math.toRadians(this.lon);

        this.earthRadius = this.ellipsoid.getRadiusAt(radLat);

        this.sinLat = Math.sin(radLat);
        this.cosLat = Math.cos(radLat);
        this.sinLon = Math.sin(radLon);
        this.cosLon = Math.cos(radLon);
    }

    @Override
    public int hashCode()
    {
        int hash = 5;
        hash = 17 * hash + (int) (Double.doubleToLongBits(this.lat) ^ (Double.doubleToLongBits(this.lat) >>> 32));
        hash = 17 * hash + (int) (Double.doubleToLongBits(this.lon) ^ (Double.doubleToLongBits(this.lon) >>> 32));
        hash = 17 * hash + (int) (Double.doubleToLongBits(this.alt) ^ (Double.doubleToLongBits(this.alt) >>> 32));
        return hash;
    }

    @Override
    public boolean equals( Object obj )
    {
        if( obj == null )
            return false;
        if( getClass() != obj.getClass() )
            return false;
        final LatLonAlt other = (LatLonAlt) obj;
        if( Double.doubleToLongBits(this.lat) != Double.doubleToLongBits(other.lat) )
            return false;
        if( Double.doubleToLongBits(this.lon) != Double.doubleToLongBits(other.lon) )
            return false;
        if( Double.doubleToLongBits(this.alt) != Double.doubleToLongBits(other.alt) )
            return false;
        return true;
    }

    public double getLatitude()
    {
        return lat;
    }

    public double getLongitude()
    {
        return lon;
    }

    public double getAltitude()
    {
        return alt;
    }

    /*
     public Matrix3x3 toLocalTransform()
     {
     return Matrix3x3.fromElements(
     -sinLon, cosLon, 0.0,
     -sinLat * cosLon, -sinLat * sinLon, cosLat,
     cosLat * cosLon, cosLat * sinLon, sinLat
     );
     }

     public Matrix3x3 toGlobalTransform()
     {
     return toLocalTransform().transpose();
     }
     */
    public double getDistanceTo( LatLonAlt to, Ellipsoid ellipsoid )
    {
        if( to == null )
            throw new NullPointerException("'to' should not be null");

        double latDiff = Math.abs(radLat - to.radLat);
        double lonDiff = Math.abs(radLon - to.radLon);

        double sin2Lat = Math.sin(latDiff / 2.0);
        double sin2Lon = Math.sin(lonDiff / 2.0);

        double r = earthRadius;
        double a = sin2Lat * sin2Lat + cosLat * to.cosLat * sin2Lon * sin2Lon;
        double c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
        return r * c;
    }

    public double getAzimutTo( LatLonAlt to )
    {
        if( to == null )
            throw new NullPointerException("'to' should not be null");

        double lonDiff = to.radLon - radLon;
        double sinLonDiff = Math.sin(lonDiff);
        double cosLonDiff = Math.cos(lonDiff);
        return Math.atan2(to.cosLat * sinLonDiff, (cosLat * to.sinLat - sinLat * to.cosLat * cosLonDiff));
    }

    public LatLonAlt extrapolateTo( double distance, double azimut )
    {
        if( distance < 0.0 )
            throw new IllegalArgumentException("distance should be >= 0.0, but is " + distance);

        double arcOnSurface = distance / earthRadius;
        double cosAzimut = Math.cos(azimut);
        double sinAzimut = Math.sin(azimut);
        double sinArcOnSurface = Math.sin(arcOnSurface);
        double cosArcOnSurface = Math.cos(arcOnSurface);

        double newLat = Math.toDegrees(Math.asin(sinLat * cosArcOnSurface + cosLat * sinArcOnSurface * cosAzimut));
        double newLon = Math.toDegrees(Math.atan2(sinArcOnSurface * sinAzimut, cosLat * cosArcOnSurface - sinLat * sinArcOnSurface * cosAzimut) + radLon);

        return LatLonAlt.fromLLA(
                newLat,
                newLon,
                this.alt
        );
    }

    @Override
    public String toString()
    {
        return "" + lat + ";" + lon + ";" + alt;
    }
}
