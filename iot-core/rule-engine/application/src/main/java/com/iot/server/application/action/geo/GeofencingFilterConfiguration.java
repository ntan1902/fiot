package com.iot.server.application.action.geo;

import com.iot.server.application.action.ActionConfiguration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GeofencingFilterConfiguration implements ActionConfiguration<GeofencingFilterConfiguration> {
  private String latitudeKey;
  private String longitudeKey;

  private Perimeter perimeter;

  @Override
  public GeofencingFilterConfiguration getDefaultConfiguration() {
    return GeofencingFilterConfiguration.builder()
            .latitudeKey("latitude")
            .longitudeKey("longitude")
            .perimeter(
                    Perimeter.builder()
                            .perimeterType(PerimeterType.CIRCLE)
                            .centerLatitude(0D)
                            .centerLongitude(0D)
                            .range(0D)
                            .rangeUnit(RangeUnit.METER)
                            .build()
            )
            .build();
  }


}
