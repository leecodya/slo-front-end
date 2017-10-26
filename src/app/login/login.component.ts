import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, AlertService } from '../_services/';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  model: any = {};
  returnUrl: string;
  registerEmail: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.registerEmail = this.route.snapshot.queryParams['email'] || null;

    if (this.registerEmail) {
      this.model.email = this.registerEmail;
      setTimeout(() => {
        this.alertService.success("Successfully registered! You may now login.", true);
      }, 500);
    }
  }

  login() {
    this.authenticationService.login(this.model.email, this.model.password)
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error("Invalid username or password.");
          console.log(error);
        }
      )
  }

}
