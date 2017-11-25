import { Component, OnInit } from '@angular/core';
import { Course, Faculty, SLO } from '../_models';
import { AuthenticationService, CourseService, AlertService, SLOService, FacultyService } from '../_services';
import { Router } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {
  loadingAccounts: Boolean = true; //loading variable for page
  makeAdminLoading: Boolean = false; //make admin button loading indicator
  selectedAccountID: number;
  accounts: Faculty[] = []; //holds loaded SLOs

  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private sloService: SLOService,
    private facultyService: FacultyService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadingAccounts = true;
    this.facultyService.getAllFaculty().subscribe(
      data => {
        this.accounts = data;
        this.loadingAccounts = false;
      },
      error => {
        this.alertService.error(error.json().message);
        console.log(error.json());
        this.loadingAccounts = false;
      }
    );
  }

  resetPassword(account: Faculty) {
    let that = this;
    
    swal({
      title: `Resetting ${account.email}`,
      text: "Please enter the new password. Minimum 8 characters.",
      input: 'password',
      showCancelButton: true,
      confirmButtonText: 'Reset',
      confirmButtonColor: '#623890',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#414141',
      customClass: 'sweet-alert-modal',
      background: '#292929',
      preConfirm: (password) => {
        return new Promise((resolve) => {
          if (password.length < 8) {
            swal.showValidationError('Password must be at least 8 characters.');
          }
          resolve();
        })
      }
    }).then(function (result) {
      if (result.value) {
        that.facultyService.resetPassword(account, result.value).subscribe(
          data => { console.log("successfully reset password"); },
          error => {
            that.alertService.error(error.json().message);
            console.log(error);
          }
        );
          
        swal({
            title: 'Successfully Reset!',
            text: "The password has been reset for the selected account.",
            type: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#623890',
            customClass: 'sweet-alert-modal',
            background: '#292929'
        });
      }
    });
  }

  toggleAdmin(account: Faculty) {
    this.makeAdminLoading = true;
    this.selectedAccountID = account.id;
    this.facultyService.toggleAdmin(account).subscribe(
      data => {
        this.makeAdminLoading = false;
        this.selectedAccountID = null;
      },
      error => {
        this.alertService.error(error.json().message);
        console.log(error);
        this.makeAdminLoading = false;
        this.selectedAccountID = null;
      }
    );
  }

  deleteAccount(account: Faculty) {
    let that = this;

    swal({
      title: `Delete ${account.email}?`,
      text: "This will delete the account AND associated courses and assessments. This may affect statistical data.",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      confirmButtonColor: '#623890',
      cancelButtonText: 'Keep',
      cancelButtonColor: '#414141',
      customClass: 'sweet-alert-modal',
      background: '#292929'
    }).then(function (result) {
      if (result.value) {
        that.facultyService.removeAccount(account).subscribe(
          data => {
            that.accounts.splice(that.accounts.findIndex(x => x.id == account.id), 1);
          },
          error => {
            that.alertService.error(error.json().message);
            console.log(error);
          }
        );
          
        swal({
            title: 'Deleted!',
            text: "The selected account has been removed.",
            type: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#623890',
            customClass: 'sweet-alert-modal',
            background: '#292929'
        });
      }
  });
  }

}
