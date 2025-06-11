package com.example.skydrop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
@Profile("production") // Only used in production profile
public class S3Config {

    @Bean
    public S3Client s3Client() {
        // In production, use environment variables or Spring properties for these values
        String accessKeyId = "YOUR_AWS_ACCESS_KEY";
        String secretAccessKey = "YOUR_AWS_SECRET_KEY";
        String region = "us-east-1";
        
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
        
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();
    }
}
