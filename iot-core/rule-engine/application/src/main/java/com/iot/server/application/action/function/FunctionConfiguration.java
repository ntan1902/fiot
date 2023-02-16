package com.iot.server.application.action.function;

import com.iot.server.application.action.ActionConfiguration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FunctionConfiguration implements ActionConfiguration<FunctionConfiguration> {
    private String script;

    @Override
    public FunctionConfiguration getDefaultConfiguration() {
        return FunctionConfiguration.builder()
                .script(
                        "return {msg: msg, metaData: metaData, msgType: msgType};"
                )
                .build();
    }
}
