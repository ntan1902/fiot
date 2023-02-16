package com.iot.server.application.action.geo;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.iot.server.application.action.AbstractRuleNodeAction;
import com.iot.server.application.action.RuleNode;
import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.application.utils.GeoUtil;
import com.iot.server.common.utils.GsonUtils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RuleNode(
        type = "ACTION",
        name = "geofencing filter",
        configClazz = GeofencingFilterConfiguration.class,
        relationNames = {"True", "False", "Success", "Failure"}
)
public class GeofencingFilterAction extends AbstractRuleNodeAction {

  private GeofencingFilterConfiguration config;

  @Override
  protected void initConfig(String config) {
    this.config = GsonUtils.fromJson(config, GeofencingFilterConfiguration.class);
  }

  @Override
  public void onMsg(RuleNodeMsg msg) {
    if (checkMatch(msg)) {
      ctx.tellTrue(msg);
    } else {
      ctx.tellFalse(msg);
    }
  }

  @Override
  public void stop() {

  }

  private boolean checkMatch(RuleNodeMsg msg) {
    JsonElement jsonElement = JsonParser.parseString(msg.getData());
    if (!jsonElement.isJsonObject()) {
      ctx.tellFailure(msg);
    }

    JsonObject json = jsonElement.getAsJsonObject();
    double latitude = getValueFromMessageByName(msg, json, config.getLatitudeKey());
    double longitude = getValueFromMessageByName(msg, json, config.getLongitudeKey());
    Perimeter perimeter = config.getPerimeter();

    return checkMatches(perimeter, latitude, longitude);
  }

  private Double getValueFromMessageByName(RuleNodeMsg msg, JsonObject json, String keyName) {
    double value = 0;
    if (json.has(keyName) && json.get(keyName).isJsonPrimitive()) {
      value = json.get(keyName).getAsDouble();
    } else {
      String valueStr = msg.getMetaData().getValue(keyName);
      if (!valueStr.isEmpty()) {
        value = Double.parseDouble(valueStr);
      } else {
        ctx.tellFailure(msg);
      }
    }
    return value;
  }


  private boolean checkMatches(Perimeter perimeter, double latitude, double longitude) {
    if (perimeter.getPerimeterType() == PerimeterType.CIRCLE) {
      Coordinates entityCoordinates = new Coordinates(latitude, longitude);
      Coordinates perimeterCoordinates = new Coordinates(perimeter.getCenterLatitude(), perimeter.getCenterLongitude());
      return perimeter.getRange() > GeoUtil.distance(entityCoordinates, perimeterCoordinates, perimeter.getRangeUnit());
    } else if (perimeter.getPerimeterType() == PerimeterType.POLYGON) {
      return GeoUtil.contains(perimeter.getPolygonLatLngs(), new Coordinates(latitude, longitude));
    } else {
      return false;
    }
  }

}
