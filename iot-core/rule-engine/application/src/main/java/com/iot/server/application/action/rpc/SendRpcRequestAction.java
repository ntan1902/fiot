package com.iot.server.application.action.rpc;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.iot.server.application.action.AbstractRuleNodeAction;
import com.iot.server.application.action.RuleNode;
import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.application.model.DeviceRpcRequest;
import com.iot.server.application.model.DeviceRpcRequestData;
import com.iot.server.common.utils.GsonUtils;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

@Slf4j
@RuleNode(
        type = "ACTION",
        name = "send rpc request",
        configClazz = SendRpcRequestConfiguration.class
)
public class SendRpcRequestAction extends AbstractRuleNodeAction {

    private SendRpcRequestConfiguration config;

    @Override
    protected void initConfig(String config) {
        this.config = GsonUtils.fromJson(config, SendRpcRequestConfiguration.class);
    }

    @Override
    public void onMsg(RuleNodeMsg msg) {
        JsonObject json = JsonParser.parseString(msg.getData()).getAsJsonObject();
        if (!json.has("method") || !json.has("params")) {
            ctx.tellFailure(msg);
        } else {
            ctx.getRpcService().sendServerRpcRequestToDevice(
                    DeviceRpcRequest.builder()
                            .id(msg.getRequestId() != null ? msg.getRequestId() : UUID.randomUUID().toString())
                            .data(
                                    DeviceRpcRequestData.builder()
                                            .method(json.get("method").getAsString())
                                            .params(parseJsonData(json.get("params")))
                                            .build()
                            )
                            .metaData(msg.getMetaData())
                            .ruleChainId(msg.getRuleChainId())
                            .userIds(msg.getUserIds())
                            .deviceId(this.config.getDeviceId())
                            .type(msg.getType())
                            .timeout(this.config.getTimeout())
                            .build(),
                    deviceRpcResponse -> {
                        if (deviceRpcResponse.getError() == null) {
                            ctx.tellSuccess(RuleNodeMsg.builder()
                                    .requestId(msg.getRequestId())
                                    .data(deviceRpcResponse.getResponse())
                                    .metaData(msg.getMetaData())
                                    .ruleChainId(msg.getRuleChainId())
                                    .userIds(msg.getUserIds())
                                    .entityId(msg.getEntityId())
                                    .type(msg.getType())
                                    .build());
                        } else {
                            ctx.tellFailure(msg);
                        }
                    }
            );
        }
    }

    @Override
    public void stop() {

    }

    private String parseJsonData(JsonElement paramsEl) {
        if (paramsEl != null) {
            return paramsEl.isJsonPrimitive() ? paramsEl.getAsString() : GsonUtils.toJson(paramsEl);
        } else {
            return null;
        }
    }
}
