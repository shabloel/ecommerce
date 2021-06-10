package com.shabloel.ecommerce.service;

import com.shabloel.ecommerce.dao.CustomerRepository;
import com.shabloel.ecommerce.dto.Purchase;
import com.shabloel.ecommerce.dto.PurchaseResponse;
import com.shabloel.ecommerce.model.Customer;
import com.shabloel.ecommerce.model.Order;
import com.shabloel.ecommerce.model.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

/**
 * @author : christiaan.griffioen
 * @since :  19-5-2021, wo
 **/

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        Order order = purchase.getOrder();
        String trackingNumber = generateOrderTrackingNumner();
        order.setOrderTrackingNumber(trackingNumber);
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.addOrderItem(item));
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());

        Customer customer = purchase.getCustomer();
        //check if this is an existing customer.
        Customer customerFromDb = customerRepository.findByEmail(customer.getEmail());
        if(customerFromDb!=null){
            customer = customerFromDb;
        }
            customer.addNewOrders(order);
            customerRepository.save(customer);

        return new PurchaseResponse(trackingNumber);
    }

    private String generateOrderTrackingNumner() {
        return UUID.randomUUID().toString();

    }
}
