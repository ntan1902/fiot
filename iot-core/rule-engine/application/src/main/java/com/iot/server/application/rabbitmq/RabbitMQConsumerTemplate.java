package com.iot.server.application.rabbitmq;

import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.application.model.DeviceRpcResponse;
import com.iot.server.application.model.RpcError;
import com.iot.server.application.service.RpcService;
import com.iot.server.application.service.RuleEngineService;
import com.iot.server.common.queue.QueueMsg;
import com.iot.server.common.utils.GsonUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;

@Component
@Slf4j
@RequiredArgsConstructor
public class RabbitMQConsumerTemplate {

  private final RuleEngineService ruleEngineService;
  private final RpcService rpcService;

  @RabbitListener(queues = "${queue.rabbitmq.device-telemetry.queue-name}", containerFactory = "deviceTelemetryFactory")
  public void postTelemetry(String msg) throws ClassNotFoundException, InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
    processMsg(msg);
  }

  @RabbitListener(queues = "${queue.rabbitmq.device-rpc.queue-name}", containerFactory = "deviceRpcFactory")
  public void rpcTelemetry(String msg) throws ClassNotFoundException, InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
    processMsg(msg);
  }

  @RabbitListener(queues = "${queue.rabbitmq.server-rpc-response.queue-name}", containerFactory = "serverRpcResponseFactory")
  public void serverRpcResponse(String msg) {
    DeviceRpcResponse deviceRpcResponse = null;
    try {
      QueueMsg queueMsg = GsonUtils.fromJson(msg, QueueMsg.class);
      log.trace("Consume message {}", queueMsg);

      deviceRpcResponse = getDeviceRpcResponse(queueMsg);

    } catch (RuntimeException exception) {
      log.error("Error occurred", exception);

      deviceRpcResponse = DeviceRpcResponse.builder()
              .response(null)
              .error(RpcError.INTERNAL)
              .build();
    } finally {
      rpcService.receiveServerRpcResponseFromDevice(deviceRpcResponse);
    }
  }

  @RabbitListener(queues = "${queue.rabbitmq.client-rpc-request.queue-name}", containerFactory = "clientRpcRequestFactory")
  public void clientRpcRequest(String msg) throws ClassNotFoundException, InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
    processMsg(msg);
  }

  private void processMsg(String msg) throws ClassNotFoundException, InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
    try {
      QueueMsg queueMsg = GsonUtils.fromJson(msg, QueueMsg.class);
      log.trace("Consume message {}", queueMsg);

      RuleNodeMsg ruleNodeMsg = getRuleNodeMsg(queueMsg);

      ruleEngineService.process(ruleNodeMsg);
    } catch (RuntimeException exception) {
      log.error("Error occurred", exception);
    }
  }

  private RuleNodeMsg getRuleNodeMsg(QueueMsg queueMsg) {
    return RuleNodeMsg.builder()
            .requestId(queueMsg.getKey())
            .type(queueMsg.getType())
            .ruleChainId(queueMsg.getRuleChainId())
            .entityId(queueMsg.getEntityId())
            .userIds(queueMsg.getUserIds())
            .data(queueMsg.getData())
            .metaData(queueMsg.getMetaData())
            .build();
  }

  private DeviceRpcResponse getDeviceRpcResponse(QueueMsg queueMsg) {
    return DeviceRpcResponse.builder()
            .requestId(queueMsg.getKey())
            .response(queueMsg.getData())
            .build();
  }

}
