package com.iot.server.rest.client.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ClientHttpConnector;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;
import reactor.netty.resources.LoopResources;

import java.util.concurrent.TimeUnit;

@Configuration
public class WebClientConfig {
  @Bean
  @LoadBalanced
  WebClient.Builder builder() {
    return WebClient.builder();
  }

  @Bean
  WebClient webClient(WebClient.Builder builder) {
    return builder.clientConnector(getClientConnector()).build();
  }

  private ClientHttpConnector getClientConnector() {
    // This is implicit default if you use TcpClient#create()
    ConnectionProvider connectionProvider = ConnectionProvider.create("tcp", 5000);
    LoopResources loopResources = LoopResources.create("reactor-tcp");

    HttpClient httpClient = HttpClient.create(connectionProvider)
            .runOn(loopResources)
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 30_000)
            .doOnConnected(
                    connection ->
                            connection
                                    .addHandlerLast(new ReadTimeoutHandler(5000,
                                            TimeUnit.MILLISECONDS))
                                    .addHandlerLast(new WriteTimeoutHandler(5000,
                                            TimeUnit.MILLISECONDS)));

    return new ReactorClientHttpConnector(httpClient);

  }

}
