package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.EmptyRequest;
import com.iot.server.common.exception.IoTException;
import com.nimbusds.jose.jwk.JWKSet;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class GetJwkSetHandler extends BaseHandler<EmptyRequest, Map<String, Object>> {
    private final JWKSet jwkSet;

    @Override
    protected void validate(EmptyRequest request) throws IoTException {

    }

    @Override
    protected Map<String, Object> processRequest(EmptyRequest request) {
        return jwkSet.toJSONObject();
    }
}
