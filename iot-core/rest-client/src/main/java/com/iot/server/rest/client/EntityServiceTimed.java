package com.iot.server.rest.client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class EntityServiceTimed {

  private final WebClient webClient;

  public String get(String host, String path, MultiValueMap<String, String> queryParams) {

    Mono<String> responseMono =
            webClient.get()
                    .uri(uriBuilder -> uriBuilder.host(host)
                            .path(path)
                            .queryParams(queryParams)
                            .build())
                    .retrieve()
                    .bodyToMono(String.class);

    return responseMono.block();
  }

  public String post(String host, String path, Object body) {

    Mono<String> responseMono =
            webClient.post()
                    .uri(uriBuilder -> uriBuilder.host(host)
                            .path(path)
                            .build())
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class);

    return responseMono.block();
  }

  public String head(String host, String path) {

    Mono<String> responseMono =
            webClient.head()
                    .uri(uriBuilder -> uriBuilder.host(host)
                            .path(path)
                            .build())
                    .retrieve()
                    .bodyToMono(String.class);

    return responseMono.block();
  }
}