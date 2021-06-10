package com.shabloel.ecommerce.dao;

import com.shabloel.ecommerce.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * @author : christiaan.griffioen
 * @since :  13-5-2021, do
 **/
@RepositoryRestResource(collectionResourceRel = "countries", path = "countries")
public interface CountryRepository extends JpaRepository<Country, Integer> {
}
