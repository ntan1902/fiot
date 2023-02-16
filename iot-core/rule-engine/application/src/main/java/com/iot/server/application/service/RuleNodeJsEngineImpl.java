package com.iot.server.application.service;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.common.enums.ReasonEnum;
import com.iot.server.common.exception.IoTException;
import com.iot.server.common.model.MetaData;
import com.iot.server.common.utils.GsonUtils;
import com.iot.server.common.utils.ScriptUtils;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Slf4j
public class RuleNodeJsEngineImpl implements RuleNodeJsEngine {
    private final NashornService nashornService;
    private final UUID scriptId;

    public RuleNodeJsEngineImpl(NashornService nashornService, String script, String... args) {
        this.nashornService = nashornService;

        this.scriptId = this.nashornService.eval(script, args);
    }

    @Override
    public CompletableFuture<String> executeToStringAsync(RuleNodeMsg msg) {
        Object[] args = getArgs(msg);

        return executeScriptAsync(args)
                .thenApply(JsonElement::getAsString);
    }

    @Override
    public CompletableFuture<Void> executeUpdateAsync(RuleNodeMsg msg) {
        Object[] args = getArgs(msg);
        return executeScriptAsync(args)
                .thenAccept(jsonElement -> convertToRuleNodeMsg(jsonElement, msg));
    }

    @Override
    public CompletableFuture<Boolean> executeFilterAsync(RuleNodeMsg msg) {
        Object[] args = getArgs(msg);

        return executeScriptAsync(args)
                .thenApply(JsonElement::getAsBoolean);
    }

    @Override
    public void stop() {

    }

    private void convertToRuleNodeMsg(JsonElement jsonElement, RuleNodeMsg msg) {
        if (jsonElement.isJsonObject()) {

            String data = null;
            Map<String, String> metaData = null;
            String msgType = null;

            JsonObject jsonObject = jsonElement.getAsJsonObject();

            if (jsonObject.has(ScriptUtils.MSG)) {
                JsonElement dataMsg = jsonObject.get(ScriptUtils.MSG);
                data = GsonUtils.toJson(dataMsg);
            }

            if (jsonObject.has(ScriptUtils.META_DATA)) {
                JsonElement metaDataMsg = jsonObject.get(ScriptUtils.META_DATA);
                metaData = GsonUtils.fromJson(metaDataMsg.toString(), new TypeToken<Map<String, String>>() {
                }.getType());
            }

            if (jsonObject.has(ScriptUtils.MSG_TYPE)) {
                msgType = jsonObject.get(ScriptUtils.MSG_TYPE).getAsString();
            }

            if (data != null) {
                msg.setData(data);
            }

            if (metaData != null) {
                msg.setMetaData(new MetaData(metaData));
            }

            if (msgType != null) {
                msg.setType(msgType);
            }

        } else {
            throw new IoTException(ReasonEnum.CONVERT_RULE_NODE_MSG_FAILED, "Failed to convert rule node msg from javascript result");
        }

    }

    private CompletableFuture<JsonElement> executeScriptAsync(Object... args) {
        return CompletableFuture
                .supplyAsync(() -> JsonParser.parseString(this.nashornService.invokeFunction(this.scriptId, args).toString()));
    }

    private JsonElement executeScript(Object... args) {
        return JsonParser.parseString(this.nashornService.invokeFunction(this.scriptId, args).toString());
    }

    private Object[] getArgs(RuleNodeMsg msg) {
        try {
            Object[] args = new Object[3];

            if (msg.getData() != null) {
                args[0] = msg.getData();
            } else {
                args[0] = "";
            }

            args[1] = GsonUtils.toJson(msg.getMetaData().getData());
            args[2] = msg.getType();
            return args;
        } catch (Exception ex) {
            throw new IoTException(ReasonEnum.BIND_JS_ARGS_FAILED, "Cannot bind js args: " + ex.getMessage());
        }
    }

}
