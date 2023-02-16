package com.iot.server.domain;

import com.iot.server.common.enums.TransportType;
import com.iot.server.domain.model.ValidateDeviceToken;

public interface TransportService {
  void process(TransportType transportType, ValidateDeviceToken validateDeviceToken, String json);

  void gwProcess(TransportType transportType, ValidateDeviceToken validateDeviceToken, String json);

  void sendServerRpcResponseToRuleEngine(String message, String routingKey);

  void sendClientRpcRequestToRuleEngine(String message, String routingKey);
}
