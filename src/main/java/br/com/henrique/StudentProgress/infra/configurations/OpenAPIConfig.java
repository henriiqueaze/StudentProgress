package br.com.henrique.StudentProgress.infra.configurations;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    OpenAPI customOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("StudentProgress API")
                .version("V1")
                .description("StudentProgress is a Spring Boot application for managing and tracking student data, including grades and academic status. It provides an API for registering, updating, and monitoring student records, calculating averages, and offering real-time insights into student performance, helping educational institutions streamline their processes.")
                .termsOfService("https://henriiqueaze.github.io/Portfolio-Henrique/")
                .license(new License()
                    .name("MIT License")
                    .url("https://github.com/henriiqueaze/StudentProgress?tab=MIT-1-ov-file")));
    }
}
