import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from '../common/customer';
import { Order } from '../common/order';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

baseUrl: string = 'http://localhost:8080/api/orders/search/findByCustomerEmailOrderByDateCreatedDesc'

  constructor(private httpClient: HttpClient) { }

  getOrdersForExistingUser(theEmail: string):Observable<getOrders>{
    const searchUrl: string = this.baseUrl+`?email=${theEmail}`;
    return this.httpClient.get<getOrders>(searchUrl);
  }
}

interface getOrders{
  _embedded: {
    orders: OrderHistory[];
  }
  
}