import { Component, OnInit } from '@angular/core';
import { Course, Faculty } from './../_models/';
import { SLOService, AlertService, FacultyService } from './../_services/';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {
  reportLoading: Boolean = false; //loading state variable for reports section
  loadingProgress: Boolean = false; //loading state variable for progress section
  file_url: String = ""; // holds download link when report is successfully generated
  courses: Course[]; //list of all courses from the progress endpoint.
  uniqueYears: Set<Date> = new Set();
  uniqueFaculty: Faculty[] = []; //holds unique faculty members
  currentSection: String = 'Class Reports';
  faculty_progress_year; // holds selection for faculty progress dropdown

  // form data model for the export selection
  export_form = {
    course_type: 'courses',
    year: 'All Years'
  };

  constructor(
    private sloService: SLOService,
    private alertService: AlertService,
    private facultyService: FacultyService
  ) { }

  ngOnInit() {
    this.loadingProgress = true;
    this.facultyService.getProgress().subscribe(
      data => {
        this.courses = data;

        //used to populate year dropdown
        this.uniqueYears = new Set(data.map(x => x.course_year).sort().reverse());
        this.faculty_progress_year = Array.from(this.uniqueYears)[0];
        // basically populate uniqueFaculty with a list of faculty members WITHOUT duplicates
        for (let course of this.courses.filter(x => x.course_year == this.faculty_progress_year)) {
          if (this.uniqueFaculty.map(e => e.faculty_id).indexOf(course.faculty.faculty_id) == -1) {
            this.uniqueFaculty.push(course.faculty);
          }
        }

        this.loadingProgress = false;
      },
      error => {
        this.alertService.error(error);
        this.loadingProgress = false;
      }
    )
  }

  updateFacultyProgress() {
    this.uniqueFaculty = []; //empty out uniqueFaculty

    //regenerate uniqueFaculty based on newly selected course_year
    for (let course of this.courses.filter(x => x.course_year == this.faculty_progress_year)) {
      if (this.uniqueFaculty.map(e => e.faculty_id).indexOf(course.faculty.faculty_id) == -1) {
        this.uniqueFaculty.push(course.faculty);
      }
    }
  }

  getFacultyCourses(faculty) {
    return this.courses.filter(x => x.faculty.faculty_id == faculty.faculty_id && x.course_year == this.faculty_progress_year);
  }

  generateReport() {
    this.reportLoading = true;
    let year_filter = this.export_form.year == 'All Years' ? null : this.export_form.year;

    this.sloService.getReport(this.export_form.course_type, year_filter).subscribe(
      data => {
        this.file_url = data.file_url;
        this.reportLoading = false;
      },
      error => {
        this.reportLoading = false;
      }
    );
  }

  loadSection(section) {
    this.currentSection = section;
  }
}
