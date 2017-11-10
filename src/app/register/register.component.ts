import { Component, OnInit } from '@angular/core';
import { FacultyService, AlertService } from '../_services';
import { Router } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { Faculty } from '../_models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  form; //register form

  constructor(
    private facultyService: FacultyService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new ValidationManager({
      'email': 'required|email',
      'faculty_id': 'required|minLength:9|maxLength:9|number',
      'first_name': {'rules': 'required', 'value': ''},
      'last_name': {'rules': 'required', 'value': ''},
      'password': 'required|rangeLength:8,50',
      'confirm_password': 'required|equalTo:password'
    });
  }


  submit() {
    let faculty = new Faculty({
      email: this.form.getData().email,
      faculty_id: this.form.getData().faculty_id,
      first_name: this.form.getData().first_name,
      last_name: this.form.getData().last_name
    });
    
    this.facultyService.register(faculty, this.form.getData().password).subscribe(
      data => {
        this.alertService.success("Successfully registered! You may now login.", true);
        this.router.navigate(['/login'], { queryParams: { email: data.email } });
      },
      error => {
        this.alertService.error(error.json().message);
        console.log(error);
      }
    )
  }

}
