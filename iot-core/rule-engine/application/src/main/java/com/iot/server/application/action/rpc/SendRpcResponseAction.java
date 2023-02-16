package com.iot.server.application.action.rpc;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.iot.server.application.action.AbstractRuleNodeAction;
import com.iot.server.application.action.EmptyConfiguration;
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
        name = "send rpc response",
        configClazz = EmptyConfiguration.class
)
public class SendRpcResponseAction extends AbstractRuleNodeAction {

    private EmptyConfiguration config;

    @Override
    protected void initConfig(String config) {
        this.config = GsonUtils.fromJson(config, EmptyConfiguration.class);
    }

    @Override
    public void onMsg(RuleNodeMsg msg) {

        String requestId = msg.getMetaData().getValue("requestId");

        try {
            this.ctx.getRpcService().sendClientRpcResponseToDevice(requestId, msg.getEntityId(), msg.getData());
            this.ctx.tellSuccess(msg);
        } catch (Exception exception) {
            log.error("Failed to send client rpc response to device, requestId={}, deviceId={}", requestId, msg.getEntityId(), exception);
            this.ctx.tellFailure(msg);
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
