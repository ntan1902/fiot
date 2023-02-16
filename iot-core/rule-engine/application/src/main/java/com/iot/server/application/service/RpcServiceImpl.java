package com.iot.server.application.service;

import com.iot.server.application.model.DeviceRpcRequest;
import com.iot.server.application.model.DeviceRpcResponse;
import com.iot.server.application.model.RpcError;
import com.iot.server.common.queue.QueueMsg;
import com.iot.server.common.utils.GsonUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.function.Consumer;

@Service
@Slf4j
@RequiredArgsConstructor
public class RpcServiceImpl implements RpcService {

  private final ConcurrentMap<String, Consumer<DeviceRpcResponse>> deviceRpcResponseMap = new ConcurrentHashMap<>();
  private final RabbitTemplate serverRpcRequestRabbitTemplate;
  private final RabbitTemplate clientRpcResponseRabbitTemplate;
  private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

  @PreDestroy
  public void shutdownExecutor() {
    scheduler.shutdownNow();
  }

  @Override
  public void sendServerRpcRequestToDevice(DeviceRpcRequest request, Consumer<DeviceRpcResponse> response) {
    deviceRpcResponseMap.put(request.getId(), response);
    serverRpcRequestRabbitTemplate.convertAndSend(
            GsonUtils.toJson(new QueueMsg(request.getId(), request.getDeviceId(), request.getRuleChainId(), GsonUtils.toJson(request.getData()), request.getMetaData(), request.getType(), request.getUserIds()))
    );
    scheduleTimeout(request.getId(), request.getTimeout());
  }

  @Override
  public void receiveServerRpcResponseFromDevice(DeviceRpcResponse response) {
    log.trace("{} Received response to server-side RPC request from Core RPC Service", response.getRequestId());
    Consumer<DeviceRpcResponse> consumer = deviceRpcResponseMap.remove(response.getRequestId());
    if (consumer != null) {
      scheduler.submit(() -> consumer.accept(response));
    } else {
      log.trace("{} Unknown or stale rpc response received {}", response.getRequestId(), response);
    }
  }

  @Override
  public void sendClientRpcResponseToDevice(String requestId, UUID entityId, String data) {
    clientRpcResponseRabbitTemplate.convertAndSend(
            GsonUtils.toJson(new QueueMsg(requestId, entityId, null, data, null, null, null))
    );
  }

  private void scheduleTimeout(String requestId, int timeout) {
    log.trace("Processing the request: {}", requestId);
    scheduler.schedule(() -> {
      Consumer<DeviceRpcResponse> consumer = deviceRpcResponseMap.remove(requestId);
      if (consumer != null) {
        log.trace("Timeout the request: {}", requestId);
        scheduler.submit(() -> consumer.accept(new DeviceRpcResponse(requestId, null, RpcError.TIMEOUT)));
      }
    }, timeout, TimeUnit.MILLISECONDS);
  }

}
