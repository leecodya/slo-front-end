import { Component, OnInit } from '@angular/core';
import { FacultyService } from '../_services';
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
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new ValidationManager({
      'email': 'required|email',
      'faculty_id': 'required|minLength:9|maxLength:9|number',
      'first_name': {'rules': 'required', 'value': 'Deep'},
      'last_name': {'rules': 'required', 'value': 'Patel'},
      'password': 'required',
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
        console.log("SUCCESSFULLY REGISTERED");
        console.log(data);
      },
      error => {
        console.log("WHOOPS");
        console.log(error);
      }
    )
  }

}
