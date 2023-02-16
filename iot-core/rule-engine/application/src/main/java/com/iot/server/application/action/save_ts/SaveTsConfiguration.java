package com.iot.server.application.action.save_ts;

import com.iot.server.application.action.ActionConfiguration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SaveTsConfiguration implements ActionConfiguration<SaveTsConfiguration> {
    private long defaultTTL;
    private boolean skipLatestPersistence;
    private boolean useServerTs;

    @Override
    public SaveTsConfiguration getDefaultConfiguration() {
        return SaveTsConfiguration.builder()
                .defaultTTL(0L)
                .skipLatestPersistence(false)
                .useServerTs(false)
                .build();
    }
}
