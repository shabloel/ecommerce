import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  //in case you want to store the session data locally on your computer
  // storageLocal: Storage = localStorage;

  constructor() { 

    let data = JSON.parse(this.storage.getItem('cartItems'));

    if(data != null){
      this.cartItems = data;

      this.computeTotals();
    }
  }

  addToCart(theCartItem: CartItem){
    let alreadyIn: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length>0){
      existingCartItem = this.cartItems.find( a => a.id == theCartItem.id);
    }
    alreadyIn = (existingCartItem != undefined);
    if(alreadyIn){
      existingCartItem.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }
    this.computeTotals();
  }

  removeFromCart(theCartItem:CartItem){
    theCartItem.quantity--;
    if(theCartItem.quantity === 0){
       this.remove(theCartItem);
      }else{
        this.computeTotals();
      }
      
    }

  computeTotals() {
    let totalPriceTemp:number = 0;
    let totalQuantityTemp:number = 0;
    for(let tempCartItem of this.cartItems){   
      totalPriceTemp += tempCartItem.quantity * tempCartItem.unitPrice;
      totalQuantityTemp += tempCartItem.quantity;
    }
    this.totalPrice.next(totalPriceTemp);
    this.totalQuantity.next(totalQuantityTemp);

    this.logCartData(totalPriceTemp, totalQuantityTemp);

    this.persistCartItems();

  }

  remove(theCartItem: CartItem){
    const itemIndex = this.cartItems.findIndex(a => a.id == theCartItem.id)
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeTotals();
    }   
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceTemp: number, totalQuantityTemp: number) {
    console.log(`Contents of the card`);
    for(let tempItem of this.cartItems){
      console.log(`name: ${tempItem.name}
                    quantity: ${tempItem.quantity}
                    unitPrice: ${tempItem.unitPrice}`);
    }
    console.log(`Total price: ${totalPriceTemp} 
                  total quantity: ${totalQuantityTemp}`);
    console.log(`-----------`);
  }
}
