import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }
  
  getCreditCardMonths(startMonth: number):Observable<number[]>{
    
    let data:number[]=[];
    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }
    return of(data); //Returns an Observable instance that synchronously delivers the values provided as arguments.
  }

  getCreditCardYears():Observable<number[]>{

    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
        data.push(theYear);
    }
    return of(data); //Returns an Observable instance that synchronously delivers the values provided as arguments.
  }

  returnHttpCountries():Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries));
  } 

  //pipe() function in RxJS: You can use pipes to link operators together. Pipes let you combine multiple functions into a single function.
  
  returnHttpStatesOnCountryCode(countryCode: string):Observable<State[]>{
    const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states));
  } 
}

interface GetResponseCountries{
    _embedded: {
      countries: Country[];
    }
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  }
}
