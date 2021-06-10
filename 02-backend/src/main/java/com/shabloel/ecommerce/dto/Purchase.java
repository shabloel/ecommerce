package com.shabloel.ecommerce.dto;

import com.shabloel.ecommerce.model.Address;
import com.shabloel.ecommerce.model.Customer;
import com.shabloel.ecommerce.model.Order;
import com.shabloel.ecommerce.model.OrderItem;
import lombok.Data;

import java.util.Set;

/**
 * @author : christiaan.griffioen
 * @since :  19-5-2021, wo
 **/

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
