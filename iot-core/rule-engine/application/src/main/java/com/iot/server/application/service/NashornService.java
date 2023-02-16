package com.iot.server.application.service;

import javax.script.ScriptException;
import java.util.UUID;

public interface NashornService {
    UUID eval(String script, String... args);

    Object invokeFunction(UUID scriptId, Object... args);

    void stop(UUID scriptId) throws ScriptException;
}
