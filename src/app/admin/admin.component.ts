import { Component, OnInit } from '@angular/core';
import { Course, Faculty } from './../_models/';
import { SLOService, AlertService, FacultyService } from './../_services/';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {
  reportLoading: Boolean = false;
  loadingProgress: Boolean = false;
  file_url: String = "";
  courses: Course[];
  uniqueFaculty: Faculty[] = [];

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

        // basically populate uniqueFaculty with a list of faculty members WITHOUT duplicates
        for (let course of this.courses) {
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

  getFacultyCourses(faculty) {
    return this.courses.filter(x => x.faculty.faculty_id == faculty.faculty_id);
  }

  generateReport() {
    this.reportLoading = true;
    this.sloService.getReport().subscribe(
      data => {
        this.file_url = data.file_url;
        this.reportLoading = false;
      },
      error => {
        this.reportLoading = false;
      }
    );
  }
}
