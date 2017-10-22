import { Component, OnInit } from '@angular/core';
import { AuthenticationService, CourseService, AlertService } from '../_services';
import { Course, Faculty } from '../_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  courses: Course[] = [];
  visibleCourses: Course[] = [];
  faculty: Faculty = new Faculty();
  currentSection: String = "complete";

  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private courseService: CourseService
  ) { }

  ngOnInit() {
    this.courseService.getCourses().subscribe(
      data => {
        this.courses = data;
        this.visibleCourses = this.courses.filter(x => !x.completion);
        this.faculty = this.courses[0].faculty;
        console.log(this.visibleCourses);
      },
      error => {
        this.alertService.error("Unidentified error occurred");
        console.log(error);
      }
    )
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
