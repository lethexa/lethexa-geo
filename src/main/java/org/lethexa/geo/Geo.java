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

/**
 * This class is immutable
 */
public class Geo
{
    private static final double EPSILON = 0.001;

    public static Vec3 latLonAltToVec3(LatLonAlt lla, Ellipsoid ellipsoid)
    {
        if (ellipsoid == null)
            throw new NullPointerException("ellipsoid should not be null");

        double radLat = Math.toRadians(lla.getLatitude());
        double radLon = Math.toRadians(lla.getLongitude());
        double alt = lla.getAltitude();
        
        double sinLat = Math.sin(radLat);
        double cosLat = Math.cos(radLat);
        double sinLon = Math.sin(radLon);
        double cosLon = Math.cos(radLon);

        /*
        this.geoToLocal = Matrix3x3.fromElements(
            -dSinLon, dCosLon, 0.0,
            -dSinLat * dCosLon, -dSinLat * dSinLon, dCosLat,
            dCosLat * dCosLon, dCosLat * dSinLon, dSinLat);
        this.geoToGlobal = geoToLocal.transpose();
        */
        double V = ellipsoid.a() / Math.sqrt(1.0 - ellipsoid.e2() * sinLat * sinLat);

        double x = (V + alt) * cosLat * cosLon;
        double y = (V + alt) * cosLat * sinLon;
        double z = ((1.0 - ellipsoid.e2()) * V + alt) * sinLat;

        return Vec3.fromElements(x, y, z);
    }

    public static LatLonAlt vec3ToLatLonAlt( Vec3 geocentricPos, Ellipsoid ellipsoid )
    {
        if( geocentricPos == null )
            throw new NullPointerException("geocentricPos should not be null");
        if( ellipsoid == null )
            throw new NullPointerException("ellipsoid should not be null");

        double x = geocentricPos.x();
        double y = geocentricPos.y();
        double z = geocentricPos.z();

        double radTempLat = 0.0;
        double radTempLon = Math.atan2(y, x);
        double alt = 0.0;
        double xy = Math.sqrt(x * x + y * y);
        double dOldLat, dOldAlt;
        double sinTempLat = Math.sin(radTempLat);
        double cosTempLat = Math.cos(radTempLat);
        do
        {
            dOldLat = radTempLat;
            dOldAlt = alt;

            double dV = ellipsoid.a() / Math.sqrt(1.0 - ellipsoid.e2() * sinTempLat * sinTempLat);
            radTempLat = Math.atan((z - alt * ellipsoid.e2() * sinTempLat) / (xy * (1.0 - ellipsoid.e2())));

            sinTempLat = Math.sin(radTempLat);
            cosTempLat = Math.cos(radTempLat);

            alt = xy / cosTempLat - dV;
        }
        while (Math.abs(dOldLat - radTempLat) > EPSILON || Math.abs(dOldAlt - alt) > EPSILON);

        double radLat = radTempLat;
        double radLon = radTempLon;
        
        /*
        double sinLat = sinTempLat;
        double cosLat = cosTempLat;
        double sinLon = Math.sin(radTempLon);
        double cosLon = Math.cos(radTempLon);

        geoToLocal = Matrix3x3.fromElements(
            -dSinLon, dCosLon, 0.0,
            -dSinLat * dCosLon, -dSinLat * dSinLon, dCosLat,
            dCosLat * dCosLon, dCosLat * dSinLon, dSinLat);
        geoToGlobal = geoToLocal.transpose();
        */

        return LatLonAlt.fromLLA(
                Math.toDegrees(radLat), 
                Math.toDegrees(radLon), 
                alt
        );
    }
}
