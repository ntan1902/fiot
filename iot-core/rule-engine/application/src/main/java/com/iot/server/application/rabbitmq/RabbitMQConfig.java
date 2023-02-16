package com.iot.server.application.rabbitmq;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Data
@ConfigurationProperties(prefix = "queue.rabbitmq")
@Configuration
@Component
@Slf4j
public class RabbitMQConfig {

    private Config deviceTelemetry;
    private Config deviceRpc;
    private Config serverRpcRequest;
    private Config serverRpcResponse;
    private Config clientRpcRequest;
    private Config clientRpcResponse;
    private Config telemetry;
    private Config debug;
    private Config alarm;

    public ConnectionFactory createConnectionFactory(Config config) {
        CachingConnectionFactory rabbitConnectionFactory = new CachingConnectionFactory();
        rabbitConnectionFactory.setHost(config.host);
        rabbitConnectionFactory.setPort(config.port);
        rabbitConnectionFactory.setUsername(config.username);
        rabbitConnectionFactory.setPassword(config.password);
        rabbitConnectionFactory.setConnectionTimeout(config.connectionTimeout);
        return rabbitConnectionFactory;
    }

    // DEVICE TELEMETRY
    @Bean
    public Queue deviceTelemetryQueue() {
        return new Queue(deviceTelemetry.queueName);
    }

    @Bean
    public FanoutExchange deviceTelemetryExchange() {
        return new FanoutExchange(deviceTelemetry.exchangeName);
    }

    @Bean
    public Binding deviceTelemetryBinding(Queue deviceTelemetryQueue, FanoutExchange deviceTelemetryExchange) {
        return BindingBuilder.bind(deviceTelemetryQueue).to(deviceTelemetryExchange);
    }

    @Bean
    public SimpleRabbitListenerContainerFactory deviceTelemetryFactory() {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(createConnectionFactory(deviceTelemetry));
        return factory;
    }

    // DEVICE RPC
    @Bean
    public Queue deviceRpcQueue() {
        return new Queue(deviceRpc.queueName);
    }

    @Bean
    public FanoutExchange deviceRpcExchange() {
        return new FanoutExchange(deviceRpc.exchangeName);
    }

    @Bean
    public Binding deviceRpcBinding(Queue deviceRpcQueue, FanoutExchange deviceRpcExchange) {
        return BindingBuilder.bind(deviceRpcQueue).to(deviceRpcExchange);
    }

    @Bean
    public SimpleRabbitListenerContainerFactory deviceRpcFactory() {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(createConnectionFactory(telemetry));
        return factory;
    }

    // SERVER RPC REQUEST
    @Bean
    public RabbitTemplate serverRpcRequestRabbitTemplate() {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(createConnectionFactory(serverRpcRequest));
        rabbitTemplate.setExchange(serverRpcRequest.exchangeName);
        return rabbitTemplate;
    }

    // SERVER RPC RESPONSE
    @Bean
    public Queue serverRpcResponseQueue() {
        return new Queue(serverRpcResponse.queueName);
    }

    @Bean
    public FanoutExchange serverRpcResponseExchange() {
        return new FanoutExchange(serverRpcResponse.exchangeName);
    }

    @Bean
    public Binding serverRpcResponseBinding(Queue serverRpcResponseQueue, FanoutExchange serverRpcResponseExchange) {
        return BindingBuilder.bind(serverRpcResponseQueue).to(serverRpcResponseExchange);
    }

    @Bean
    public SimpleRabbitListenerContainerFactory serverRpcResponseFactory() {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(createConnectionFactory(serverRpcResponse));
        return factory;
    }

    // CLIENT RPC REQUEST
    @Bean
    public Queue clientRpcRequestQueue() {
        return new Queue(clientRpcRequest.queueName);
    }

    @Bean
    public FanoutExchange clientRpcRequestExchange() {
        return new FanoutExchange(clientRpcRequest.exchangeName);
    }

    @Bean
    public Binding clientRpcRequestBinding(Queue clientRpcRequestQueue, FanoutExchange clientRpcRequestExchange) {
        return BindingBuilder.bind(clientRpcRequestQueue).to(clientRpcRequestExchange);
    }

    // CLIENT RPC RESPONSE
    @Bean
    public RabbitTemplate clientRpcResponseRabbitTemplate() {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(createConnectionFactory(clientRpcResponse));
        rabbitTemplate.setExchange(clientRpcResponse.exchangeName);
        return rabbitTemplate;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory clientRpcRequestFactory() {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(createConnectionFactory(clientRpcRequest));
        return factory;
    }

    @Bean
    public RabbitTemplate telemetryRabbitTemplate() {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(createConnectionFactory(telemetry));
        rabbitTemplate.setExchange(telemetry.exchangeName);
        return rabbitTemplate;
    }

    @Bean
    public RabbitTemplate debugRabbitTemplate() {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(createConnectionFactory(debug));
        rabbitTemplate.setExchange(debug.exchangeName);
        return rabbitTemplate;
    }

    @Bean
    public RabbitTemplate alarmRabbitTemplate() {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(createConnectionFactory(alarm));
        rabbitTemplate.setExchange(alarm.exchangeName);
        return rabbitTemplate;
    }

    @Bean
    public RabbitAdmin rabbitAdmin() {
        RabbitAdmin rabbitAdmin = new RabbitAdmin(createConnectionFactory(deviceTelemetry));

        rabbitAdmin.declareExchange(deviceTelemetryExchange());
        rabbitAdmin.declareQueue(deviceTelemetryQueue());
        rabbitAdmin.declareBinding(deviceTelemetryBinding(deviceTelemetryQueue(), deviceTelemetryExchange()));

        rabbitAdmin.declareExchange(deviceRpcExchange());
        rabbitAdmin.declareQueue(deviceRpcQueue());
        rabbitAdmin.declareBinding(deviceRpcBinding(deviceRpcQueue(), deviceRpcExchange()));

        return rabbitAdmin;
    }

    @Getter
    @Setter
    public static class Config {
        private String queueName;
        private String exchangeName;
        private String host;
        private int port;
        private String username;
        private String password;
        private int connectionTimeout;
        private String routingKey;
    }

}
