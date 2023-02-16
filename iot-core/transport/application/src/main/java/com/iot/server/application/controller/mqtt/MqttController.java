package com.iot.server.application.controller.mqtt;

import com.iot.server.application.controller.request.PostTelemetryRequest;
import com.iot.server.common.enums.TransportType;
import com.iot.server.common.utils.GsonUtils;
import com.iot.server.domain.TransportService;
import com.iot.server.domain.model.BasicMqttCredentials;
import com.iot.server.domain.model.ValidateDeviceToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Component
public class MqttController {

  private final TransportService transportService;

  @RabbitListener(queues = "${queue.rabbitmq.devices-telemetry-mqtt.queue-name}", containerFactory = "deviceTelemetryMqttFactory")
  public void onDevicesPostTelemetry(String message) {
    log.info("Received message {} from device", message);
    try {
      PostTelemetryRequest request = GsonUtils.fromJson(message, PostTelemetryRequest.class);

      if (isMQTTCredentials(request)) {
        BasicMqttCredentials basicMqttCredentials = GsonUtils.fromJson(request.getToken().toString(), BasicMqttCredentials.class);
        log.info("[username = " + basicMqttCredentials.getUsername() + ", password = " + basicMqttCredentials.getPassword() + "]");

        transportService.process(
                TransportType.MQTT,
                ValidateDeviceToken.builder().basicMqttCredentials(basicMqttCredentials).build(),
                GsonUtils.toJson(request.getJson())
        );
      } else {
        transportService.process(
                TransportType.DEFAULT,
                ValidateDeviceToken.builder().token((String) request.getToken()).build(),
                GsonUtils.toJson(request.getJson())

        );
      }
    } catch (RuntimeException ex) {
      log.error("Bad credentials mqtt ", ex);
    }

  }

  private boolean isMQTTCredentials(PostTelemetryRequest request) {
    return request.getToken() instanceof BasicMqttCredentials
            || request.getToken() instanceof Map;
  }

  @RabbitListener(queues = "${queue.rabbitmq.gateway-telemetry-mqtt.queue-name}", containerFactory = "gatewayTelemetryMqttFactory")
  public void onGatewayPostTelemetry(String message) {
    log.info("Received message {} from gateway", message);
    try {
      PostTelemetryRequest request = GsonUtils.fromJson(message, PostTelemetryRequest.class);
      if (isMQTTCredentials(request)) {
        BasicMqttCredentials basicMqttCredentials = GsonUtils.fromJson(request.getToken().toString(), BasicMqttCredentials.class);
        log.info("[username = " + basicMqttCredentials.getUsername() + ", password = " + basicMqttCredentials.getPassword() + "]");

        transportService.gwProcess(
                TransportType.MQTT,
                ValidateDeviceToken.builder().basicMqttCredentials(basicMqttCredentials).build(),
                GsonUtils.toJson(request.getJson())
        );
      } else {
        transportService.gwProcess(
                TransportType.DEFAULT,
                ValidateDeviceToken.builder().token((String) request.getToken()).build(),
                GsonUtils.toJson(request.getJson())

        );
      }
    } catch (RuntimeException ex) {
      log.error("Bad credentials mqtt ", ex);
    }

  }

  @RabbitListener(queues = "${queue.rabbitmq.server-rpc-response-mqtt.queue-name}", containerFactory = "serverRpcResponseMqttFactory")
  public void onServerRpcResponse(String message,
                                  @Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey) {
    log.info("Received message {} from device with routingKey={}", message, routingKey);
    try {
      transportService.sendServerRpcResponseToRuleEngine(message, routingKey);
    } catch (RuntimeException ex) {
      log.error("Failed to process server rpc response message={}, topic={} ", message, routingKey, ex);
    }

  }

  @RabbitListener(queues = "${queue.rabbitmq.client-rpc-request-mqtt.queue-name}", containerFactory = "clientRpcRequestMqttFactory")
  public void onClientRpcRequest(String message,
                                 @Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey) {
    log.info("Received message {} from device with routingKey={}", message, routingKey);
    try {
      transportService.sendClientRpcRequestToRuleEngine(message, routingKey);
    } catch (RuntimeException ex) {
      log.error("Failed to process server rpc request message={}, topic={} ", message, routingKey, ex);
    }

  }
}
