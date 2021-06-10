package com.shabloel.ecommerce.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * @author : christiaan.griffioen
 * @since :  18-5-2021, di
 **/
@Entity
@Table(name="customer", schema="ecommerce")
@Getter
@Setter
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="customer_id")
    private Long customerId;

    @Column(name="first_name")
    private String firstName;

    @Column(name="last_name")
    private String lastName;

    @Column(name="email")
    private String email;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<Order> orders = new HashSet<>();

    public void addNewOrders(Order theOrder){
        if(theOrder!=null){
            if(orders==null){
                orders = new HashSet<>();
            }
            orders.add(theOrder);
            theOrder.setCustomer(this);
        }
    }
}
