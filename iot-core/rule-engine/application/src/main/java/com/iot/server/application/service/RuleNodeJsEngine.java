package com.iot.server.application.service;

import com.iot.server.application.message.RuleNodeMsg;

import java.util.concurrent.CompletableFuture;

public interface RuleNodeJsEngine {

    CompletableFuture<String> executeToStringAsync(RuleNodeMsg msg);

    CompletableFuture<Void> executeUpdateAsync(RuleNodeMsg msg);

    CompletableFuture<Boolean> executeFilterAsync(RuleNodeMsg msg);

    void stop();
}
