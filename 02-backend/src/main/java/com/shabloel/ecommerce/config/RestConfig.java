package com.shabloel.ecommerce.config;

import com.shabloel.ecommerce.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * @author : christiaan.griffioen
 * @since :  20-4-2021, di
 **/

@Configuration
public class RestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Value("${allowed.origins}")
    private String[] allowedOrigins;

    @Autowired
    public RestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theNotAllowedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        disableHttpMethods(Product.class, config, theNotAllowedActions);
        disableHttpMethods(ProductCategory.class, config, theNotAllowedActions);
        disableHttpMethods(Country.class, config, theNotAllowedActions);
        disableHttpMethods(State.class, config, theNotAllowedActions);
        disableHttpMethods(Order.class, config, theNotAllowedActions);

        cors.addMapping(config.getBasePath()+"/**").allowedOrigins(allowedOrigins);

        exposeIds(config);
    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theNotAllowedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure(( metdata, httpMethods) -> httpMethods.disable(theNotAllowedActions))
                .withCollectionExposure((metdata, httpMethods)-> httpMethods.disable(theNotAllowedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config){
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        List<Class> entityClasses = new ArrayList<>();

        for(EntityType entityType : entities){
            entityClasses.add(entityType.getJavaType());
        }

        Class[] domainTypes = entityClasses.toArray(new Class[0]);

        System.out.println("********" + domainTypes[0]);
        config.exposeIdsFor(domainTypes);

    }
}
