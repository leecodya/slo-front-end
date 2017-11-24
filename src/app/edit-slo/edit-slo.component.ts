import { Component, OnInit } from '@angular/core';
import { Course, Faculty, SLO, PerformanceIndicator } from '../_models';
import { AuthenticationService, CourseService, AlertService, SLOService, FacultyService } from '../_services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-edit-slo',
  templateUrl: './edit-slo.component.html',
  styleUrls: ['./edit-slo.component.sass']
})
export class EditSLOComponent implements OnInit {
  currentSection: String = "active"; //section selection variable for courses section
  loadingSLO: Boolean = true; //loading variable for booleans
  slos: SLO[] = []; //holds loaded SLOs
  selectedSLO: SLO;
  editSLOForm: FormGroup;

  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private courseService: CourseService,
    private sloService: SLOService,
    private facultyService: FacultyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.editSLOForm = this.formBuilder.group({
      slo_id: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(2)])],
      slo_description: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(255)])],
      performance_indicators: this.formBuilder.array([ this.createPIFormGroup('01') ])
    });

    this.loadingSLO = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      let slo_id = params['slo_id'];

      this.sloService.getSLOS().subscribe(
        data => this.slos = data,
        error => console.log(error)
      );

      this.sloService.getSLO(new SLO({ slo_id: slo_id })).subscribe(
        data => {
          this.selectedSLO = data;
          this.initializeForm(this.selectedSLO);
          this.loadingSLO = false;
        },
        error => {
          this.alertService.error(error.message);
          console.log(error);
        }
      )
    });

  }

  initializeForm(slo: SLO) {
    this.editSLOForm = this.formBuilder.group({
      slo_id: [slo.slo_id, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(2)])],
      slo_description: [slo.slo_description, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(255)])],
      performance_indicators: this.formBuilder.array(slo.performance_indicators.map(x => this.createExistingPIFormGroup(x)))
    });
  }

  createExistingPIFormGroup(pi: PerformanceIndicator) {
    return this.formBuilder.group({
      performance_indicator_id: [pi.performance_indicator_id.slice(3), Validators.required],
      performance_indicator_description: [pi.performance_indicator_description, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(255)])],
      unsatisfactory_description: [pi.unsatisfactory_description, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(500)])],
      developing_description: [pi.developing_description, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(500)])],
      satisfactory_description: [pi.satisfactory_description, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(500)])],
      exemplary_description: [pi.exemplary_description, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(500)])]
    });
  }

  createPIFormGroup(idToSet?: string): FormGroup {
    let autoGeneratedId = null;
    
    if (!idToSet) {
      let items = this.editSLOForm.get('performance_indicators') as FormArray;
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
    let items = this.editSLOForm.get('performance_indicators') as FormArray;
    items.push(this.createPIFormGroup());
  }

  submit(formValue) {
    console.log(formValue);

    if (this.editSLOForm.valid) {
      if (!this.sloIDMatches(formValue.slo_id)) {
        this.alertService.error(`You cannot change the SLO ID!`);
        return;
      }

      let slo = new SLO(formValue);
      this.sloService.updateSLO(slo).subscribe(
        data => {
          this.alertService.success("SLO successfully updated.", true);
          this.initializeForm(data);
          //this.router.navigate(['/slo', data.slo_id]);
        },
        error => {
          this.alertService.error(error.json().message);
          console.log(error.json());
        }
      )
    } else {
      this.markFormGroupTouched(this.editSLOForm);
    }
  }

  sloIDMatches(slo_id): Boolean {
    if (this.selectedSLO.slo_id == slo_id) {
      return true; // true, since it matches ORIGINAL slo ID
    } else {
      return false;
    }
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
          let items = that.editSLOForm.get('performance_indicators') as FormArray;
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

}
