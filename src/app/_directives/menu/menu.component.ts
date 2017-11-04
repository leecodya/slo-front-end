import { Component, OnInit } from '@angular/core';
import { Faculty } from '../../_models/';
import { Router, ActivatedRoute } from '@angular/router';
import { FacultyService, HelperService, AuthenticationService } from '../../_services/';

@Component({
    selector: 'menu-bar',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.sass']
})

export class MenuComponent implements OnInit {
    user: Faculty = new Faculty({ user_type: "0" });
    minutesTillExpiry = 60;
    model: any = {};
    timeouts = [];

    constructor(
        private facultyService: FacultyService, 
        private helperService: HelperService,
        private authenticationService: AuthenticationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.facultyService.getUserInfo().subscribe(
            data => {
                this.user = data;
                this.checkExpiry(true)
            },
            error => {
                console.log(error);
                this.checkExpiry()
            }
        );
    }

    checkExpiry(recur = false) {
        this.minutesTillExpiry = this.helperService.timeToExpiryInMinutes();
        if (recur) {
            return this.timeouts.push(setTimeout(() => this.checkExpiry(true), 1000 * 60));
        } else {
            return;
        }
    }

    ngOnDestroy() {
        for (var i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }
    }

    login() {
        this.authenticationService.login(this.user.email.toString(), this.model.password)
          .subscribe(
            data => {
              this.facultyService.getUserInfo().subscribe(
                  data => {
                      this.user = data;
                      this.checkExpiry()
                  },
                  error => {
                      console.log(error);
                  }
              );
            },
            error => {
                console.log(error);
                this.router.navigate(['/login']);
            }
          );
      }
}
