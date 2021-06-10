import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  products: Product[];

  constructor(private router: Router) { }

  ngOnInit(){}

  doSearch(info: string) {
    console.log(`search key:${info}`);
    this.router.navigateByUrl(`/search/${info}`);
  }
}
