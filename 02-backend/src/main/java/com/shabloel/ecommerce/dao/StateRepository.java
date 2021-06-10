package com.shabloel.ecommerce.dao;

import com.shabloel.ecommerce.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

/**
 * @author : christiaan.griffioen
 * @since :  13-5-2021, do
 **/
@RepositoryRestResource
public interface StateRepository extends JpaRepository<State, Integer> {

    List<State> findByCountryCode(@Param("code") String code);
    //http://localhost:8080/api/states/search/findByCountryCountryCode?code=IN
}
