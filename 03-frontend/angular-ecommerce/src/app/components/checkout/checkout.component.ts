import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Customer } from 'src/app/common/customer';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import {MyValidators} from 'src/app/validators/my-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditMonths: number[] = [];

  countries: Country[] = [];
 
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage:Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
                private formService: FormService,
                private cartService: CartService,
                private checkoutService: CheckoutService,
                private router: Router) { }

  ngOnInit(): void {

    const email: string = JSON.parse(this.storage.getItem('userEmail'));
    const firstName: string = JSON.parse(this.storage.getItem('firstName'));
    const lastName: string = JSON.parse(this.storage.getItem('lastName'));

    this.reviewCartDetails();

    const startMonth: number = new Date().getMonth() + 1;
    
    this.formService.returnHttpCountries().subscribe(
      data => this.countries = data
    );

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data=>{this.creditMonths = data}
    );


    this.formService.getCreditCardYears().subscribe(
      data=> {this.creditCardYears = data
      }
    );

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl(firstName, [Validators.required, 
                                        Validators.minLength(2),
                                        MyValidators.validateWhiteSpaces]),
        lastName: new FormControl(lastName, [Validators.required, 
                                      Validators.minLength(2),
                                      MyValidators.validateWhiteSpaces]),
        email: new FormControl(email,    [Validators.required, 
                                      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
                                      MyValidators.validateWhiteSpaces])
      }),
      shippingAdres: this.formBuilder.group({
        street: new FormControl('', [Validators.required,
                                      Validators.minLength(2),
                                      MyValidators.validateWhiteSpaces]),
        city: new FormControl('', [Validators.required,
                                   Validators.minLength(2),
                                   MyValidators.validateWhiteSpaces]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
                                      Validators.minLength(2),
                                      MyValidators.validateWhiteSpaces]),
      }),
      billingAdres: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required,
                                    Validators.minLength(2),
                                    MyValidators.validateWhiteSpaces]),
        city: new FormControl('', [Validators.required,
                                   Validators.minLength(2),
                                   MyValidators.validateWhiteSpaces]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
                                      Validators.minLength(2),
                                      MyValidators.validateWhiteSpaces]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required,
                                        Validators.minLength(2),
                                        MyValidators.validateWhiteSpaces]),
        cardNumber: new FormControl('', [Validators.required,
                                          Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required,
                                          Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
  }
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
  }

  onSubmit(){
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order:Order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;

    let orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem));

    let purchase:Purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAdres'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.stateName;
    purchase.shippingAddress.country = shippingCountry.countryName;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAdres'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.stateName;
    purchase.billingAddress.country = billingCountry.countryName;

    purchase.orderItems = orderItems;
    purchase.order = order;

    this.checkoutService.savePurchase(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber}`)
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );

    console.log("Handling form submission");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer').value.email);
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAdres').value.country.countryName);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAdres').value.state.stateName);
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingStreet() {
    return this.checkoutFormGroup.get('shippingAdres.street');
  }
  get shippingCity() {
    return this.checkoutFormGroup.get('shippingAdres.city');
  }
  get shippingState() {
    return this.checkoutFormGroup.get('shippingAdres.state');
  }

  get shippingCountry() {
    return this.checkoutFormGroup.get('shippingAdres.country');
  }

  get shippingZipcode() {
    return this.checkoutFormGroup.get('shippingAdres.zipCode');
  }

  get billingCountry() {
    return this.checkoutFormGroup.get('billingAdres.country');
  }
  get billingStreet() {
    return this.checkoutFormGroup.get('billingAdres.street');
  }
  get billingCity() {
    return this.checkoutFormGroup.get('billingAdres.city');
  }
  get billingState() {
    return this.checkoutFormGroup.get('billingAdres.state');
  }
  get billingZipcode() {
    return this.checkoutFormGroup.get('billingAdres.zipCode');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardName() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  get creditCardExpirationMonth() {
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }

  get creditCardExpirationYear() {
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }

  copyShippingAddressToBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAdres
        .setValue(this.checkoutFormGroup.controls.shippingAdres.value);

        this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.controls.billingAdres.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    let startMonth: number;

    if(selectedYear === currentYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data=>{this.creditMonths = data
      }
    );

  }

  selectCorrespondingStates(theFormGroup: string){
    const formGroup =  this.checkoutFormGroup.get(theFormGroup);
    const countryCode: string = formGroup.value.country.code;
    console.log(`the country code: ${countryCode}`);
    this.formService.returnHttpStatesOnCountryCode(countryCode).subscribe(
        data => {
          if(theFormGroup === 'shippingAdres'){
            this.shippingAddressStates = data;
          }else{        
            this.billingAddressStates = data;
        }
        formGroup.get('state').setValue(data[0]);
    });
  }

}
