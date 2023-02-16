package com.iot.server.application.service;

import com.iot.server.application.model.DeviceRpcRequest;
import com.iot.server.application.model.DeviceRpcResponse;

import java.util.UUID;
import java.util.function.Consumer;

public interface RpcService {
    void sendServerRpcRequestToDevice(DeviceRpcRequest request, Consumer<DeviceRpcResponse> response);

    void receiveServerRpcResponseFromDevice(DeviceRpcResponse response);

    void sendClientRpcResponseToDevice(String requestId, UUID entityId, String data);
}
