package com.iot.application.rabbitmq;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
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

   @Bean
   public RabbitTemplate alarmRabbitTemplate() {
      RabbitTemplate rabbitTemplate = new RabbitTemplate(createConnectionFactory(alarm));
      rabbitTemplate.setExchange(alarm.exchangeName);
      return rabbitTemplate;
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
