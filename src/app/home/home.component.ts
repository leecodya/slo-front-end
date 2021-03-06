import { Component, OnInit } from '@angular/core';
import { AuthenticationService, CourseService, AlertService, SLOService, FacultyService } from '../_services';
import { Router } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { Course, Faculty, SLO } from '../_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  courses: Course[] = []; //all the course data
  visibleCourses: Course[] = []; //visible courses (eg, completed, incomplete, etc.)
  loading_courses: Boolean = true; //loading indicator for courses section
  loading_slos: Boolean = true; //loading indicator for slos
  faculty: Faculty = new Faculty(); //the current faculty member that's logged in.
  currentSection: String = "incomplete"; //section selection variable for courses section
  slos = []; // each object will be { 'slo_id': value, 'slo_description': value, and 'checked': true/false }
  form; //start new assessment form
  submitLoading: Boolean = false; //if the submit form is active or not

  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private courseService: CourseService,
    private sloService: SLOService,
    private facultyService: FacultyService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new ValidationManager({
      'crn': 'required|minLength:5|maxLength:5|number',
      'semester': {'rules': 'required', 'value': 'Fall'},
      'course_number': 'required|minLength:4|maxLength:4|number',
      'course_year': {'rules': 'required|minLength:4|maxLength:4|number', 'value': '2017'},
      'course_type': {'rules': 'required', 'value': 'F2F'},
      'course_name': 'required|maxLength:255'
    });

    this.loading_courses = true;
    this.facultyService.getUserInfo().subscribe(
      data => { this.faculty = data },
      error => { console.log(error) }
    );

    this.courseService.getCourses().subscribe(
      data => {
        this.courses = data;
        let incompleteCourses = this.courses.filter(x => !x.completion);
        let completeCourses = this.courses.filter(x => x.completion);

        if (incompleteCourses.length == 0) {
          this.visibleCourses = completeCourses;
          this.currentSection = 'complete';
        } else {
          this.visibleCourses = incompleteCourses;
          this.currentSection = 'incomplete';
        }
        
        this.loading_courses = false;
      },
      error => {
        this.alertService.error("Unidentified error occurred");
        console.log(error);
        this.loading_courses = false;
      }
    );

    this.loading_slos = true;
    this.sloService.getSLOS().subscribe(
      data => {
        data.filter(x => !x.archived).forEach(x => this.slos.push({ 
          'slo_id': x.slo_id, 
          'slo_description': x.slo_description, 
          'checked': false 
        }));
        this.loading_slos = false;
      },
      error => {
        console.log(error);
        this.loading_slos = false;
      }
    )
  }


  selectSLO(slo, event) {
    this.slos.forEach(element => {
      if (element.slo_id == slo.slo_id) {
        element.checked = !element.checked;
      }
    });
  }


  submit() {
    this.alertService.clear();
    let selectedSLOS = this.slos.filter(x => x.checked);
    if (selectedSLOS.length === 0) {
      this.alertService.error("You must select at least one assigned SLO.");
      return;
    }

    let myCourse: Course = new Course(this.form.getData());
    let courseEntryDate = new Date();
    courseEntryDate.setFullYear(this.form.getData().course_year);

    myCourse.assigned_slos = selectedSLOS.map(x => new SLO(x));
    myCourse.faculty = this.faculty;
    myCourse.course_year = courseEntryDate;

    this.submitLoading = true;
    this.courseService.createCourse(myCourse).subscribe(
      data => {
        this.submitLoading = false;
        this.alertService.success("Course successfully added");
        this.router.navigate(['/assessment', data.crn]);
      },
      error => {
        this.submitLoading = false;
        this.alertService.error(error.json().message);
        console.log(error.json());
      }
    );
  }

  loadSection(section) {
    if (section == 'complete') {
      this.visibleCourses = this.courses.filter(x => x.completion);
      this.currentSection = 'complete';
    }
    else if (section == 'incomplete') {
      this.visibleCourses = this.courses.filter(x => !x.completion);
      this.currentSection = 'incomplete';
    }
  }

}
