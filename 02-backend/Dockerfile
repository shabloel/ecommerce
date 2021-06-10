FROM maven:3.6.3-openjdk-15
COPY ./ ./workspace
RUN mvn clean package -f ./workspace/
 
ENTRYPOINT ["java", "-jar", "./workspace/target/spring-boot-ecommerce-0.0.1-SNAPSHOT.jar"]
