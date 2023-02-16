package com.iot.server.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.iot.server"})
@SpringBootConfiguration
@EnableJpaRepositories(basePackages = {"com.iot.server"})
@EntityScan(basePackages = {"com.iot.server"})
@EnableEurekaClient
@ComponentScan({"com.iot.server"})
public class Application {

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

//  @Override
//  public void run(String... args) throws Exception {
//    TelegramBot bot = new TelegramBot("5149611706:AAFyBucMOoSa3o3zcLf_WELVmMolS4hKTjw");
//    bot.execute(new SendMessage("5286520661", "hello"));
//
//    RestTemplate restTemplate = new RestTemplate();
//    String forObject = restTemplate.getForObject("https://tinuni-default-rtdb.firebaseio.com/Users.json", String.class);
//    System.out.println(forObject);
//
//    URI hello = restTemplate.postForLocation("https://tinuni-default-rtdb.firebaseio.com/Users.json", "{\"msg\": \"Hello\"}");
//    System.out.println(hello);
//  }
}

