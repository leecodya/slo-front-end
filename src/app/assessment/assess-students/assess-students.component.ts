import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { ValidationManager } from 'ng2-validation-manager';
import { Course, SLO, Assessment, Student, Score } from '../../_models/';
import { SLOService, AlertService, AssessmentService } from '../../_services/';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';


@Component({
  selector: 'app-assess-students',
  templateUrl: './assess-students.component.html',
  styleUrls: ['./assess-students.component.sass']
})

export class AssessStudentsComponent implements OnInit {
    @Input()
    course: Course;
    slos: any; // will be list of SLO[] objects. ForkJoin issues required type: any
    assessments: Assessment[];
    selectedStudentId: String;

    form = [];
    formLoading = false;

    loadingSlos: Boolean = true;
    loadingAssessments: Boolean = true;
    

    @Output('advance')
    advanceSection: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
      private alertService: AlertService,
      private sloService: SLOService,
      private assessmentService: AssessmentService
    ) { }

    ngOnInit() {
      let sloRequests = [];
      this.course.assigned_slos.forEach(slo => {
        sloRequests.push(this.sloService.getSLO(slo));
      });

      Observable.forkJoin(sloRequests).subscribe(
        slos => {
          this.slos = slos;
          this.loadingSlos = false;
          this.generateFormObject();

          this.assessmentService.getAssessments(this.course).subscribe(
            data => { 
              this.assessments = data;
              this.loadingAssessments = false;
              this.course.students.length > 0 ? this.loadStudent(this.course.students[0]) : null;
            },
            error => {
              this.loadingAssessments = false;
              console.log(error);
            }
          );
        },
        error => {
          this.loadingSlos = false;
          console.log(error);
        }
      );
    }

    ngOnChanges(changes: SimpleChange) {
      if (changes['course'] && ! changes['course'].isFirstChange()) {
          this.course = changes['course'].currentValue;
      }
   }

    nextSection() {

    }

    save(goToNextStudent?: Boolean) {
      this.formLoading = true;
      let assessmentBatch = [];
      this.form.forEach(individualAssessment => {
        console.log(this.selectedStudentId);
        let assessment = new Assessment({
          assessment_id: individualAssessment.assessment_id,
          slo: new SLO({ slo_id: individualAssessment.slo_id }),
          student: new Student({ student_id: this.selectedStudentId }),
          course: new Course({ crn: this.course.crn }),
          scores: individualAssessment.performance_indicators.map(x => new Score({ performance_indicator_id: x.performance_indicator_id, score: +x.score }))
        });

        if (assessment.assessment_id) {
          assessmentBatch.push(this.assessmentService.updateAssessment(assessment));
        } else {
          assessmentBatch.push(this.assessmentService.createAssessment(assessment));
        }
      });

      Observable.forkJoin(assessmentBatch).subscribe(
        newlyCreatedAssessments => {
          this.assessmentService.getAssessments(this.course).subscribe(
            data => {
              console.log(data);
              console.log(this.assessments);
              this.assessments = data;
              this.formLoading = false;
              goToNextStudent ? this.nextStudent() : null;
            },
            error => {
              this.alertService.error(error);
              console.log(error);
            }
          );
        },
        error => {
          this.formLoading = false;
          this.alertService.error(error);
          console.log(error);
        }
      );
    }

    loadSelectedStudent(event: Event) {
      let studentId = (<HTMLInputElement>event.target).value;
      this.loadStudent(new Student({ student_id: studentId }));
    }

    loadStudent(student: Student) {
      let matchingStudentAssessments = this.assessments.filter(x => { 
        return x.student.student_id === student.student_id 
      });

      matchingStudentAssessments.forEach(x => {
        let matchingFormObj = this.form.find(y => y.slo_id === x.slo.slo_id);
        matchingFormObj.assessment_id = x.assessment_id;
        
        x.scores.forEach(score => {
          let matchingPerfIndicator = matchingFormObj.performance_indicators.find(perf => perf.performance_indicator_id === score.performance_indicator_id);
          matchingPerfIndicator.score = score.score;
        });
      });
      
      this.selectedStudentId = student.student_id;
      if (matchingStudentAssessments.length == 0) {
        this.form.forEach(slo => {
          slo.assessment_id = null;
          slo.performance_indicators.forEach(perf => {
            perf.score = 1;
          });
        });
      }
    }


    nextStudent() {
      let currentStudentIndex = this.course.students.findIndex(x => x.student_id == this.selectedStudentId);

      if (currentStudentIndex != (this.course.students.length - 1)) {
        this.loadStudent(this.course.students[currentStudentIndex + 1]);
      }
    }

    previousStudent() {
      let currentStudentIndex = this.course.students.findIndex(x => x.student_id == this.selectedStudentId);

      if (currentStudentIndex !== 0) {
        this.loadStudent(this.course.students[currentStudentIndex - 1]);
      }
    }

    generateFormObject() {
      let that = this;

      this.slos.forEach(x => {
        let y: SLO = new SLO(x);

        let perfs = [];
        y.performance_indicators.forEach(perfIndicator => {
          perfs.push({
            performance_indicator_id: perfIndicator.performance_indicator_id,
            performance_indicator_description: perfIndicator.performance_indicator_description,
            score: 1
          });
        });
        
        that.form.push({
          slo_id: y.slo_id,
          slo_description: y.slo_description,
          assessment_id: null,
          performance_indicators: perfs
        })
      });
    }

    validateInput(event) {
      let num = parseInt(event.target.value);
      
      if (!num) {
        event.target.value = "1";
        event.target.select();
      }
      else if (num < 1) {
        event.target.value = "1";
        event.target.select();
      }
      else if (num > 4) {
        event.target.value = "4";
        event.target.select();
      }
    }

    // gets rubric info based on slo_id that's passed in. Used to create the table
    getRubric(slo_id, performance_indicator_id) {
      let slo = this.slos.find(x => x.slo_id == slo_id);
      let rubric = slo.performance_indicators.find(y => y.performance_indicator_id == performance_indicator_id);
      return rubric ? rubric : {};
    }

    showRubric(event) {
      event.target.parentNode.parentNode.classList.add('show-rubric');
    }

    hideRubric(event) {
      event.target.parentNode.parentNode.classList.remove('show-rubric');
    }
}