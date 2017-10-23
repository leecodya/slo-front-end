import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CourseService, AlertService } from '../_services';
import { Course } from '../_models';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.sass']
})
export class AssessmentComponent implements OnInit {
  course: Course = new Course();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      let crn = params['crn'];

      this.courseService.getCourse(crn).subscribe(
        data => { this.course = data },
        error => { console.log(error); }
      );
    });
  }

  deleteCourse() {
    this.courseService.deleteCourse(this.course).subscribe(
      data => {
        this.router.navigate(['/home']);
      },
      error => {
        console.log(error);
      }
    );
  }

}
