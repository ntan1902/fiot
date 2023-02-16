package com.iot.server.application.action.firebase;

import com.iot.server.application.action.ActionConfiguration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FirebaseConfiguration implements ActionConfiguration<FirebaseConfiguration> {
    private String firebaseUrl;
    private String childPath;
    private FirebaseMethod firebaseMethod;
    private String value;

    @Override
    public FirebaseConfiguration getDefaultConfiguration() {
        return FirebaseConfiguration.builder()
                .firebaseUrl(
                        "https://<your-firebase>.firebaseio.com/"
                )
                .childPath("path-to/the/data")
                .firebaseMethod(FirebaseMethod.GET)
                .value("")
                .build();
    }
}
