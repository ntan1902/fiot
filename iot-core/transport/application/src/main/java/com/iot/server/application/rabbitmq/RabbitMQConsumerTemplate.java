package com.iot.server.application.rabbitmq;

import com.google.gson.JsonParser;
import com.iot.server.common.model.Kv;
import com.iot.server.common.queue.QueueMsg;
import com.iot.server.common.utils.GsonUtils;
import com.iot.server.domain.WebSocketService;
import com.iot.server.domain.model.TelemetrySocketMsg;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class RabbitMQConsumerTemplate {

  private final WebSocketService webSocketService;
  private final RabbitTemplate serverRpcRequestMqttRabbitTemplate;
  private final RabbitTemplate clientRpcResponseMqttRabbitTemplate;

  @RabbitListener(queues = "${queue.rabbitmq.telemetry.queue-name}", containerFactory = "telemetryFactory")
  public void postTelemetry(String msg) {
    QueueMsg queueMsg = GsonUtils.fromJson(msg, QueueMsg.class);
    log.info("Consume message {}", queueMsg);

    try {
      TelemetrySocketMsg telemetrySocketMsg = new TelemetrySocketMsg();
      telemetrySocketMsg.setEntityId(queueMsg.getEntityId());
      List<Kv> kvs = GsonUtils.parseJsonElement(JsonParser.parseString(queueMsg.getData()));
      telemetrySocketMsg.setKvs(kvs);

      webSocketService.sendTelemetry(queueMsg.getUserIds(), GsonUtils.toJson(telemetrySocketMsg));
    } catch (RuntimeException exception) {
      log.error("Error occurred", exception);
    }

  }

  @RabbitListener(queues = "${queue.rabbitmq.debug.queue-name}", containerFactory = "debugFactory")
  public void debugRuleEngine(String msg) {
    QueueMsg queueMsg = GsonUtils.fromJson(msg, QueueMsg.class);
    log.info("Consume message {}", queueMsg);

    try {
      webSocketService.sendDebugMsg(queueMsg.getUserIds(), queueMsg.getData());
    } catch (RuntimeException exception) {
      log.error("Error occurred", exception);
    }

  }

  @RabbitListener(queues = "${queue.rabbitmq.alarm.queue-name}", containerFactory = "alarmFactory")
  public void alarmRuleEngine(String msg) {
    QueueMsg queueMsg = GsonUtils.fromJson(msg, QueueMsg.class);
    log.info("Consume message {}", queueMsg);

    try {
      webSocketService.sendAlarmMsg(queueMsg.getUserIds(), queueMsg.getData());
    } catch (RuntimeException exception) {
      log.error("Error occurred", exception);
    }

  }

  @RabbitListener(queues = "${queue.rabbitmq.server-rpc-request.queue-name}", containerFactory = "serverRpcRequestFactory")
  public void serverRpcRequestRuleEngine(String msg) {
    QueueMsg queueMsg = GsonUtils.fromJson(msg, QueueMsg.class);
    log.info("Consume message {}", queueMsg);

    try {
      String routingKey = serverRpcRequestMqttRabbitTemplate.getRoutingKey() + "." + queueMsg.getEntityId() + "." + queueMsg.getKey();
      serverRpcRequestMqttRabbitTemplate.convertAndSend(routingKey, queueMsg.getData());
    } catch (RuntimeException exception) {
      log.error("Error occurred", exception);
    }
  }

  @RabbitListener(queues = "${queue.rabbitmq.client-rpc-response.queue-name}", containerFactory = "clientRpcResponseFactory")
  public void clientRpcResponseRuleEngine(String msg) {
    QueueMsg queueMsg = GsonUtils.fromJson(msg, QueueMsg.class);
    log.info("Consume message {}", queueMsg);

    try {
      String routingKey = clientRpcResponseMqttRabbitTemplate.getRoutingKey() + "." + queueMsg.getEntityId() + "." + queueMsg.getKey();
      clientRpcResponseMqttRabbitTemplate.convertAndSend(routingKey, queueMsg.getData());
    } catch (RuntimeException exception) {
      log.error("Error occurred", exception);
    }

  }
}
