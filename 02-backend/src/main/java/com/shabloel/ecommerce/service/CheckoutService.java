package com.shabloel.ecommerce.service;

import com.shabloel.ecommerce.dto.Purchase;
import com.shabloel.ecommerce.dto.PurchaseResponse;

/**
 * @author : christiaan.griffioen
 * @since :  19-5-2021, wo
 **/
public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
