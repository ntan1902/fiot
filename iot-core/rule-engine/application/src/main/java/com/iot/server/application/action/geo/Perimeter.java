package com.iot.server.application.action.geo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Perimeter {

    private PerimeterType perimeterType;

    //For Polygon
    private String polygonLatLngs;

    //For Circle
    private Double centerLatitude;
    private Double centerLongitude;
    private Double range;
    private RangeUnit rangeUnit;

}
