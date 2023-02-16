package com.iot.server.application.service;

import com.iot.server.application.nashorn.NashornConfig;
import com.iot.server.common.enums.ReasonEnum;
import com.iot.server.common.exception.IoTException;
import com.iot.server.common.utils.ScriptUtils;
import delight.nashornsandbox.NashornSandbox;
import delight.nashornsandbox.NashornSandboxes;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.script.ScriptException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.ReentrantLock;

@Service
@Slf4j
public class NashornServiceImpl implements NashornService {

    private final NashornSandbox sandbox;
    private final NashornConfig config;
    private final ExecutorService executorService;

    private final Map<UUID, String> scriptIdToFunctionMap = new ConcurrentHashMap<>();
    private final ReentrantLock evalLock = new ReentrantLock();

    @Autowired
    public NashornServiceImpl(NashornConfig nashornConfig) {
        this.config = nashornConfig;

        sandbox = NashornSandboxes.create();
        executorService = Executors.newWorkStealingPool(config.getMonitorThreadPoolSize());
        sandbox.setExecutor(executorService);
        sandbox.setMaxCPUTime(config.getMaxCpuTime());
        sandbox.allowNoBraces(config.isAllowNoBraces());
        sandbox.allowLoadFunctions(config.isAllowLoadFunctions());
        sandbox.setMaxPreparedStatements(config.getMaxPreparedStatements());
    }

    @Override
    public UUID eval(String script, String... args) {
        UUID scriptId = UUID.randomUUID();
        String functionName = "invokeFunction_" + scriptId.toString().replace("-", "_");
        String jsScript = ScriptUtils.getScript(functionName, script, args);

        scriptIdToFunctionMap.put(scriptId, functionName);

        try {
            evalLock.lock();
            sandbox.eval(jsScript);
        } catch (ScriptException e) {
            log.debug("Failed to compile JS script: {}", e.getMessage(), e);
            throw new IoTException(ReasonEnum.JS_EXECUTE_FAILED, e.getMessage());
        } finally {
            evalLock.unlock();
        }

        return scriptId;
    }

    @Override
    public Object invokeFunction(UUID scriptId, Object... args) {
        String functionName = scriptIdToFunctionMap.get(scriptId);
        try {
            return sandbox.getSandboxedInvocable().invokeFunction(functionName, args);
        } catch (ScriptException | NoSuchMethodException e) {
            log.debug("Failed to invoke function: {}", e.getMessage(), e);
            throw new IoTException(ReasonEnum.INVOKE_FUNCTION_FAILED, e.getMessage());
        }
    }

    @Override
    public void stop(UUID scriptId) throws ScriptException {
        String functionName = scriptIdToFunctionMap.remove(scriptId);

        sandbox.eval(functionName + " = undefined;");
    }
}
