package com.shabloel.ecommerce.dao;

import com.shabloel.ecommerce.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author : christiaan.griffioen
 * @since :  19-5-2021, wo
 **/

//not annotated so not exposed
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmail(String theEmail);
}
