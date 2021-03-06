import { Component, OnInit } from '@angular/core';
import { Course, Faculty, SLO } from '../_models';
import { AuthenticationService, CourseService, AlertService, SLOService, FacultyService } from '../_services';
import { Router } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-slo',
  templateUrl: './slo.component.html',
  styleUrls: ['./slo.component.sass']
})
export class SLOComponent implements OnInit {
  currentSection: String = "active"; //section selection variable for courses section
  loadingSLOs: Boolean = true; //loading variable for booleans
  slos: SLO[] = []; //holds loaded SLOs
  visible_slos: SLO[] = [];
  newSLOForm: FormGroup;
  submitLoading: Boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private courseService: CourseService,
    private sloService: SLOService,
    private facultyService: FacultyService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.newSLOForm = this.formBuilder.group({
      slo_id: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(2)])],
      slo_description: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(255)])],
      performance_indicators: this.formBuilder.array([ this.createPIFormGroup('01') ])
    })

    this.loadingSLOs = true;
    this.sloService.getSLOS().subscribe(
      data => {
        this.slos = data;
        this.visible_slos = this.slos.filter(x => !x.archived); //by default, only the "active" SLOs are visible
        this.loadingSLOs = false;
      },
      error => {
        console.log(error);
        this.loadingSLOs = false;
      }
    );
  }

  createPIFormGroup(idToSet?: string): FormGroup {
    let autoGeneratedId = null;
    
    if (!idToSet) {
      let items = this.newSLOForm.get('performance_indicators') as FormArray;
      let usedIds = items.controls.map(x => x['controls'].performance_indicator_id.value);
  
      if (usedIds.length == 0) {
        autoGeneratedId = '01';
      } else {
        autoGeneratedId = this.padDigits(parseInt(usedIds[usedIds.length - 1]) + 1, 2);
      }
    } else {
      autoGeneratedId = idToSet;
    }

    return this.formBuilder.group({
      performance_indicator_id: [autoGeneratedId, Validators.required],
      performance_indicator_description: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(255)])],
      unsatisfactory_description: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(500)])],
      developing_description: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(500)])],
      satisfactory_description: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(500)])],
      exemplary_description: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(500)])]
    });
  }

  addEmptyPIFormGroup(): void {
    let items = this.newSLOForm.get('performance_indicators') as FormArray;
    items.push(this.createPIFormGroup());
  }

  sloPIControlsArray() {
    return (<any>this.newSLOForm.get('performance_indicators')).controls;
  }

  submit(formValue) {
    this.submitLoading = true;

    if (this.newSLOForm.valid) {
      if (!this.sloIDIsUnique(formValue.slo_id)) {
        this.alertService.error(`SLO ID must be unique! The SLO with the ID ${formValue.slo_id} already exists.`);
        this.submitLoading = false;
        return;
      }

      let slo = new SLO(formValue);
      this.sloService.createSLO(slo).subscribe(
        data => {
          this.alertService.success("SLO successfully created.", false);
          this.submitLoading = false;
          this.router.navigate(['/slo', data.slo_id]);
        },
        error => {
          this.alertService.error(error.message);
          this.submitLoading = false;
          console.log(error);
        }
      )
    } else {
      this.markFormGroupTouched(this.newSLOForm);
      this.submitLoading = false;
    }
  }

  sloIDIsUnique(slo_id): Boolean {
    let isUnique = true;

    this.slos.map(x => {
      if (x.slo_id === slo_id) {
        isUnique = false;
      }
    });

    return isUnique;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number;
  }

  addPI() {
    this.addEmptyPIFormGroup();
  }

  removePI(pi_index) {
    let that = this;
    swal({
        title: `Are You Sure?`,
        text: "This will delete the selected performance indicator. You will lose anything entered in this performance indicator.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#623890',
        cancelButtonText: 'Keep',
        cancelButtonColor: '#414141',
        customClass: 'sweet-alert-modal',
        background: '#292929'
      }).then(function (result) {
        if (result.value) {
          let items = that.newSLOForm.get('performance_indicators') as FormArray;
          items.removeAt(pi_index);
            
          swal({
              title: 'Deleted!',
              text: "Your PI has been removed.",
              type: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#623890',
              customClass: 'sweet-alert-modal',
              background: '#292929'
          });
        }
    });
  }

  loadSection(section) {
    if (section == 'active') {
      this.visible_slos = this.slos.filter(x => !x.archived);
      this.currentSection = 'active';
    }
    else if (section == 'archived') {
      this.visible_slos = this.slos.filter(x => x.archived);
      this.currentSection = 'archived';
    }
  }

}
