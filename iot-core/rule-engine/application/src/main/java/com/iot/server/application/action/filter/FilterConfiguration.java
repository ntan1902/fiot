package com.iot.server.application.action.filter;

import com.iot.server.application.action.ActionConfiguration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FilterConfiguration implements ActionConfiguration<FilterConfiguration> {
    private String script;

    @Override
    public FilterConfiguration getDefaultConfiguration() {
        return FilterConfiguration.builder()
                .script(
                        "return msg.temperature > 50;"
                )
                .build();
    }
}