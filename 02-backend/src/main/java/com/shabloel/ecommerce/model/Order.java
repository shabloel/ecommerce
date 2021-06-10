package com.shabloel.ecommerce.model;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * @author : christiaan.griffioen
 * @since :  19-5-2021, wo
 **/
@Entity
@Table(name="orders", schema="ecommerce")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="order_id")
    private Long orderId;

    @Column(name="order_tracking_number")
    private String orderTrackingNumber;

    @Column(name="total_price")
    private BigDecimal totalPrice;

    @Column(name="total_quantity")
    private int totalQuantity;

    @Column(name="status")
    private String status;

    @Column(name="date_created")
    @CreationTimestamp
    private Date dateCreated;

    @Column(name="last_updated")
    @UpdateTimestamp
    private Date lastUpdated;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
    private Set<OrderItem> orderItems = new HashSet<>();

    @ManyToOne
    @JoinColumn(name="customer_id")
    private Customer customer;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="shipping_address_id", referencedColumnName = "address_id")
    private Address shippingAddress;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="billing_address_id", referencedColumnName = "address_id")
    private Address billingAddress;

    public void addOrderItem(OrderItem theOrderItem){
        if(theOrderItem!=null){
            if(orderItems == null){
                orderItems = new HashSet<>();
            }
            orderItems.add(theOrderItem);
            theOrderItem.setOrder(this);
        }
    }

}
