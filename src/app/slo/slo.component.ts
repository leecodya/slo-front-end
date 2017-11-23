import { Component, OnInit } from '@angular/core';
import { Course, Faculty, SLO } from '../_models';
import { AuthenticationService, CourseService, AlertService, SLOService, FacultyService } from '../_services';
import { Router } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

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
      slo_id: '',
      slo_title: '',
      slo_description: '',
      performance_indicators: this.formBuilder.array([ this.createPIFormGroup() ])
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

  createPIFormGroup(): FormGroup {
    return this.formBuilder.group({
      pi_id: '',
      pi_title: '',
      pi_description: '',
      unsatisfactory: '',
      developing: '',
      satisfactory: '',
      exemplary: ''
    });
  }

  addEmptyPIFormGroup(): void {
    let items = this.newSLOForm.get('performance_indicators') as FormArray;
    items.push(this.createPIFormGroup());
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
