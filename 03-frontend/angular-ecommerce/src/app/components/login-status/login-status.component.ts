import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  storage: Storage = sessionStorage;
  isAuthenticated: boolean = false;
  userFullName: string;

  constructor(private oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {

    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        console.log("*******"+this.isAuthenticated);
        this.getUserDetails();
      }
    )
  }
  getUserDetails() {
    if(this.isAuthenticated){
      this.oktaAuthService.getUser().then(
        res => {
          this.userFullName = res.name;
          const theEmail = res.email;
          const firstName = res.given_name;
          const lastName = res.family_name;
          this.storage.setItem('userEmail', JSON.stringify(theEmail));
          this.storage.setItem('firstName', JSON.stringify(firstName));
          this.storage.setItem('lastName', JSON.stringify(lastName));
          console.log(`username: ${this.userFullName}`);
          console.log(`useremail: ${theEmail}`);
        }
      )
    }
  }
  logout(){
    this.oktaAuthService.signOut();
  }
}
