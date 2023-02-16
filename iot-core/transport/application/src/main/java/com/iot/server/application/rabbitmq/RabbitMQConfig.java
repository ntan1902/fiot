package com.iot.server.application.rabbitmq;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Data
@ConfigurationProperties(prefix = "queue.rabbitmq")
@Configuration
@Slf4j
@EnableRabbit
public class RabbitMQConfig {

  private Config telemetry;
  private Config deviceTelemetry;
  private Config debug;
  private Config alarm;
  private Config devicesTelemetryMqtt;
  private Config gatewayTelemetryMqtt;

  private Config serverRpcRequest;
  private Config serverRpcResponse;
  private Config serverRpcRequestMqtt;
  private Config serverRpcResponseMqtt;

  private Config clientRpcRequest;
  private Config clientRpcResponse;
  private Config clientRpcRequestMqtt;
  private Config clientRpcResponseMqtt;

  public ConnectionFactory createConnectionFactory(Config config) {
    CachingConnectionFactory rabbitConnectionFactory = new CachingConnectionFactory();
    rabbitConnectionFactory.setHost(config.host);
    rabbitConnectionFactory.setPort(config.port);
    rabbitConnectionFactory.setUsername(config.username);
    rabbitConnectionFactory.setPassword(config.password);
    rabbitConnectionFactory.setConnectionTimeout(config.connectionTimeout);
    return rabbitConnectionFactory;
  }

  // POST TELEMETRY
  @Bean
  public Queue telemetryQueue() {
    return new Queue(telemetry.queueName);
  }

  @Bean
  public FanoutExchange telemetryExchange() {
    return new FanoutExchange(telemetry.exchangeName);
  }

  @Bean
  public Binding telemetryBinding(Queue telemetryQueue, FanoutExchange telemetryExchange) {
    return BindingBuilder.bind(telemetryQueue).to(telemetryExchange);
  }

  @Bean
  public SimpleRabbitListenerContainerFactory telemetryFactory() {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(createConnectionFactory(telemetry));
    return factory;
  }

  @Bean
  public RabbitTemplate deviceTelemetryRabbitTemplate() {
    RabbitTemplate rabbitTemplate = new RabbitTemplate(createConnectionFactory(deviceTelemetry));
    rabbitTemplate.setExchange(deviceTelemetry.exchangeName);
    return rabbitTemplate;
  }


  // DEBUG
  @Bean
  public Queue debugQueue() {
    return new Queue(debug.queueName);
  }

  @Bean
  public FanoutExchange debugExchange() {
    return new FanoutExchange(debug.exchangeName);
  }

  @Bean
  public Binding debugBinding(Queue debugQueue, FanoutExchange debugExchange) {
    return BindingBuilder.bind(debugQueue).to(debugExchange);
  }

  @Bean
  public SimpleRabbitListenerContainerFactory debugFactory() {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(createConnectionFactory(debug));
    return factory;
  }

  // ALARM
  @Bean
  public Queue alarmQueue() {
    return new Queue(alarm.queueName);
  }

  @Bean
  public FanoutExchange alarmExchange() {
    return new FanoutExchange(alarm.exchangeName);
  }

  @Bean
  public Binding alarmBinding(Queue alarmQueue, FanoutExchange alarmExchange) {
    return BindingBuilder.bind(alarmQueue).to(alarmExchange);
  }

  @Bean
  public SimpleRabbitListenerContainerFactory alarmFactory() {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(createConnectionFactory(alarm));
    return factory;
  }

  // SERVER RPC REQUEST
  @Bean
  public Queue serverRpcRequestQueue() {
    return new Queue(serverRpcRequest.queueName);
  }

  @Bean
  public FanoutExchange serverRpcRequestExchange() {
    return new FanoutExchange(serverRpcRequest.exchangeName);
  }

  @Bean
  public Binding serverRpcRequestBinding(Queue serverRpcRequestQueue, FanoutExchange serverRpcRequestExchange) {
    return BindingBuilder.bind(serverRpcRequestQueue).to(serverRpcRequestExchange);
  }

  @Bean
  public SimpleRabbitListenerContainerFactory serverRpcRequestFactory() {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(createConnectionFactory(serverRpcRequest));
    return factory;
  }

  // SERVER RPC RESPONSE
  @Bean
  public RabbitTemplate serverRpcResponseRabbitTemplate() {
    RabbitTemplate rabbitTemplate = new RabbitTemplate(createConnectionFactory(serverRpcResponse));
    rabbitTemplate.setExchange(serverRpcResponse.exchangeName);
    return rabbitTemplate;
  }

  // CLIENT RPC REQUEST
  @Bean
  public RabbitTemplate clientRpcRequestRabbitTemplate() {
    RabbitTemplate rabbitTemplate = new RabbitTemplate(createConnectionFactory(clientRpcRequest));
    rabbitTemplate.setExchange(clientRpcRequest.exchangeName);
    return rabbitTemplate;
  }

  // CLIENT RPC RESPONSE
  @Bean
  public Queue clientRpcResponseQueue() {
    return new Queue(clientRpcResponse.queueName);
  }

  @Bean
  public FanoutExchange clientRpcResponseExchange() {
    return new FanoutExchange(clientRpcResponse.exchangeName);
  }

  @Bean
  public Binding clientRpcResponseBinding(Queue clientRpcResponseQueue, FanoutExchange clientRpcResponseExchange) {
    return BindingBuilder.bind(clientRpcResponseQueue).to(clientRpcResponseExchange);
  }

  @Bean
  public SimpleRabbitListenerContainerFactory clientRpcResponseFactory() {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(createConnectionFactory(clientRpcResponse));
    return factory;
  }

  // DEVICE TELEMETRY MQTT
  @Bean
  public Queue deviceTelemetryMqttQueue() {
    return new Queue(devicesTelemetryMqtt.queueName);
  }

  @Bean
  public TopicExchange deviceTelemetryMqttExchange() {
    return new TopicExchange(devicesTelemetryMqtt.exchangeName);
  }

  @Bean
  public Binding deviceTelemetryMqttBinding(Queue deviceTelemetryMqttQueue, TopicExchange deviceTelemetryMqttExchange) {
    return BindingBuilder.bind(deviceTelemetryMqttQueue).to(deviceTelemetryMqttExchange).with(devicesTelemetryMqtt.routingKey);
  }

  @Bean
  public SimpleRabbitListenerContainerFactory deviceTelemetryMqttFactory() {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(createConnectionFactory(devicesTelemetryMqtt));
    return factory;
  }

  // GATEWAY TELEMETRY MQTT
  @Bean
  public Queue gatewayTelemetryMqttQueue() {
    return new Queue(gatewayTelemetryMqtt.queueName);
  }

  @Bean
  public TopicExchange gatewayTelemetryMqttExchange() {
    return new TopicExchange(gatewayTelemetryMqtt.exchangeName);
  }

  @Bean
  public Binding gatewayTelemetryMqttBinding(Queue gatewayTelemetryMqttQueue, TopicExchange gatewayTelemetryMqttExchange) {
    return BindingBuilder.bind(gatewayTelemetryMqttQueue).to(gatewayTelemetryMqttExchange).with(gatewayTelemetryMqtt.routingKey);
  }

  @Bean
  public SimpleRabbitListenerContainerFactory gatewayTelemetryMqttFactory() {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(createConnectionFactory(gatewayTelemetryMqtt));
    return factory;
  }

  // SERVER RPC RESPONSE MQTT
  @Bean
  public Queue serverRpcResponseMqttQueue() {
    return new Queue(serverRpcResponseMqtt.queueName);
  }

  @Bean
  public TopicExchange serverRpcResponseMqttExchange() {
    return new TopicExchange(serverRpcResponseMqtt.exchangeName);
  }

  @Bean
  public Binding serverRpcResponseMqttBinding(Queue serverRpcResponseMqttQueue, TopicExchange serverRpcResponseMqttExchange) {
    return BindingBuilder.bind(serverRpcResponseMqttQueue).to(serverRpcResponseMqttExchange).with(serverRpcResponseMqtt.routingKey);
  }

  @Bean
  public SimpleRabbitListenerContainerFactory serverRpcResponseMqttFactory() {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(createConnectionFactory(serverRpcResponseMqtt));
    return factory;
  }

  // SERVER RPC REQUEST MQTT
  @Bean
  public RabbitTemplate serverRpcRequestMqttRabbitTemplate() {
    RabbitTemplate rabbitTemplate = new RabbitTemplate(createConnectionFactory(serverRpcRequestMqtt));
    rabbitTemplate.setExchange(serverRpcRequestMqtt.exchangeName);
    rabbitTemplate.setRoutingKey(serverRpcRequestMqtt.routingKey);
    return rabbitTemplate;
  }

  // CLIENT RPC REQUEST MQTT
  @Bean
  public Queue clientRpcRequestMqttQueue() {
    return new Queue(clientRpcRequestMqtt.queueName);
  }

  @Bean
  public TopicExchange clientRpcRequestMqttExchange() {
    return new TopicExchange(clientRpcRequestMqtt.exchangeName);
  }

  @Bean
  public Binding clientRpcRequestMqttBinding(Queue clientRpcRequestMqttQueue, TopicExchange clientRpcRequestMqttExchange) {
    return BindingBuilder.bind(clientRpcRequestMqttQueue).to(clientRpcRequestMqttExchange).with(clientRpcRequestMqtt.routingKey);
  }

  @Bean
  public SimpleRabbitListenerContainerFactory clientRpcRequestMqttFactory() {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(createConnectionFactory(clientRpcRequestMqtt));
    return factory;
  }

  // CLIENT RPC RESPONSE MQTT
  @Bean
  public RabbitTemplate clientRpcResponseMqttRabbitTemplate() {
    RabbitTemplate rabbitTemplate = new RabbitTemplate(createConnectionFactory(clientRpcResponseMqtt));
    rabbitTemplate.setExchange(clientRpcResponseMqtt.exchangeName);
    rabbitTemplate.setRoutingKey(clientRpcResponseMqtt.routingKey);
    return rabbitTemplate;
  }

  @Bean
  public RabbitAdmin telemetryRabbitAdmin() {
    RabbitAdmin rabbitAdmin = new RabbitAdmin(createConnectionFactory(telemetry));

    rabbitAdmin.declareExchange(telemetryExchange());
    rabbitAdmin.declareQueue(telemetryQueue());
    rabbitAdmin.declareBinding(telemetryBinding(telemetryQueue(), telemetryExchange()));

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
