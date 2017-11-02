import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { Course } from '../../_models/';
import { CourseService, AlertService } from '../../_services/';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';


@Component({
  selector: 'app-leave-comments',
  templateUrl: './leave-comments.component.html',
  styleUrls: ['./leave-comments.component.sass']
})

export class LeaveCommentsComponent implements OnInit {
    @Input()
    course: Course;
    
    form = [];
    formLoading = false;

    constructor(
      private alertService: AlertService,
      private courseService: CourseService,
      private router: Router
    ) { }

    ngOnInit() {
        
    }

    ngOnChanges(changes: SimpleChange) {
      if (changes['course'] && ! changes['course'].isFirstChange()) {
          this.course = changes['course'].currentValue;
      }
   }

   submit() {
       this.formLoading = true;
       this.courseService.updateCourse(this.course).subscribe(
           data => {
               this.alertService.success("Assessments and comments have been saved! Redirecting to home page...");
               this.formLoading = false;

               setTimeout(() => {
                   this.router.navigate(['/home']);
               }, 3000);
           },
           error => {
               this.alertService.error("Something went wrong.");
               console.log(error);
               this.formLoading = false;
           }
       )
   }
}