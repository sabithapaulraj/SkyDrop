# SkyDrop Backend

Spring Boot backend service for the SkyDrop file upload application, with AWS S3 integration.

## Features

- REST API for file uploads to AWS S3
- Progress tracking for uploads
- Pause, resume, and cancel functionality
- File status monitoring

## Prerequisites

- Java 17+
- Maven
- AWS account with S3 access

## Configuration

Before running the application, update the following configuration in `src/main/resources/application.properties`:

```properties
cloud.aws.credentials.access-key=YOUR_AWS_ACCESS_KEY
cloud.aws.credentials.secret-key=YOUR_AWS_SECRET_KEY
app.s3.bucket=YOUR_S3_BUCKET_NAME
```

And also update the credentials in `S3Config.java`:

```java
String accessKeyId = "YOUR_AWS_ACCESS_KEY";
String secretAccessKey = "YOUR_AWS_SECRET_KEY";
```

## Running the Application

```bash
mvn spring-boot:run
```

The service will be available at http://localhost:8080
