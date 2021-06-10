package com.shabloel.ecommerce.dao;

import com.shabloel.ecommerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * @author : christiaan.griffioen
 * @since :  19-4-2021, ma
 **/
@RepositoryRestResource()
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);
    //http://localhost:8080/api/products/search/findByCategoryId?id=2
    Page<Product> findByProductNameContainingIgnoreCase(@RequestParam("name") String name, Pageable pageable);
}
