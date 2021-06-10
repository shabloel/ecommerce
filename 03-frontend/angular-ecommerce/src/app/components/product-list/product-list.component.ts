import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import {Product} from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: String = "Books";
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number= 0;
  
  previousKeyword: string = null;

  categoryOrSearch: string = "Category"

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(()=> {
      this.listProducts();
    })
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }   

  }
  handleSearchProducts() {
    const keyWord: string = this.route.snapshot.paramMap.get('keyword');
    this.categoryOrSearch = "Searched for"
    this.currentCategoryName = keyWord;

    // if we have a different keyword than previous
    // then set thePageNumber to 1

    if(keyWord != this.previousKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = keyWord;

    console.log(`The searchTerm= ${keyWord}, thePageNumber= ${this.thePageNumber} `);

    
      console.log(`pagesize: ${this.thePageSize}`);
    this.productService.searchProductsPaginate(this.thePageNumber -1,
                                                this.thePageSize,
                                                keyWord,).subscribe(this.processResult());
  }

  handleListProducts(){

        //check if "id" parameter is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    
        if(hasCategoryId){
          //get the "id" param string and convert it to a number using the "+" symbol
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
          this.currentCategoryName = this.route.snapshot.paramMap.get('name');
        }
        else{
          this.currentCategoryId = 1;
          this.currentCategoryName = 'Books';
        }

        //
        //Check if we have a different category than previous
        // Note: Angular will reuse a component if it is currently being viewed
        //

        //if we have a different category id than previous
        // then set the PageNumber back to 1

        if(this.previousCategoryId != this.currentCategoryId){
          this.thePageNumber = 1;
        }

        this.previousCategoryId = this.currentCategoryId;

        console.log(`currentCatergoryId=${this.currentCategoryId},
                        thePageNumber=${this.thePageNumber}`);
        
        this.productService.getProductListPaginate(this.thePageNumber - 1, 
                                                    this.thePageSize,
                                                    this.currentCategoryId)
                                                    .subscribe(this.processResult()); 
                                                    
  }
  
  processResult(){
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber= 1;
    this.listProducts();
  }

  addToCart(theProduct: Product){
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
      console.log(`Adding to cart: ${theProduct.productName}, ${theProduct.unitPrice}`)     
  }

}
