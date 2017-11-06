import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { ValidationManager } from 'ng2-validation-manager';
import { AlertService, GraphDataService } from '../../_services/';
import { Course } from '../../_models/';
import { CourseGraphData } from '../../_models/graph-data'
import { NgxChartsModule } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-class-reports',
  templateUrl: './class-reports.component.html',
  styleUrls: ['./class-reports.component.sass']
})

export class ClassReportsComponent implements OnInit {

    @Input()
    courses: Course[];
    
    formLoading: Boolean = false;
    selectedCourseCRN: String;
    selectedCourse: Course;
    selectedCourseGraphData = [];

    config: any = {
        showXAxis: true,
        showYAxis: true,
        gradient: false,
        showLegend: false,
        showXAxisLabel: true,
        xAxisLabel: 'Percent',
        xScaleMax: 100,
        showYAxisLabel: false,
        yAxisLabel: 'Performance Indicators',
        colorScheme: 'flame',
        barPadding: 0,
        groupPadding: 16
    }

    constructor(
        private alertService: AlertService,
        private graphDataService: GraphDataService
    ) { }

    ngOnInit() {
        if (this.courses.length > 0) {
            this.selectedCourse = this.courses[0];
            this.loadCourseData(this.selectedCourse);
            this.selectedCourseCRN = this.courses[0].crn;
        } else {
            this.selectedCourse = new Course(); // initialize with empty course
        }
    }

    loadSelectedCourse(event: Event) {
        let crn = (<HTMLInputElement>event.target).value;
        console.log(crn);
        this.selectedCourse = this.courses.find(x => x.crn == crn);
        this.loadCourseData(this.selectedCourse);
    }

    loadCourseData(course: Course) {
        this.formLoading = true;
        this.graphDataService.getCourseData(course).subscribe(
            data => {
                this.processData(data);
                this.formLoading = false;
            },
            error => {
                console.log(error);
                this.formLoading = false;
            }
        );
    }

    //massage CourseGraphData into data expected by ngx-charts. Also convert from values to percentages
    processData(course: CourseGraphData) {
        this.selectedCourseGraphData = []; //reset to empty array
        for (let slo of course.assigned_slos) {
            let slo_info = {
                slo_id: slo.slo_id,
                slo_description: slo.slo_description,
                total_students: course.total_students,
                slo_data: []
            };
            
            for (let pi of slo.performance_indicators) {
                let pi_data = {
                    name: pi.performance_indicator_description,
                    series: []
                };

                let unsatisfactory_percent = Math.floor((pi.unsatisfactory / course.total_students) * 100);
                let developing_percent = Math.floor((pi.developing / course.total_students) * 100);
                let satisfactory_percent = Math.floor((pi.satisfactory / course.total_students) * 100);
                let exemplary_percent = Math.floor((pi.exemplary / course.total_students) * 100);

                pi_data.series.push({
                    name: "unsatisfactory",
                    value: isFinite(unsatisfactory_percent) ? unsatisfactory_percent : 0
                });

                pi_data.series.push({
                    name: "developing",
                    value: isFinite(developing_percent) ? developing_percent : 0
                });

                pi_data.series.push({
                    name: "satisfactory",
                    value: isFinite(satisfactory_percent) ? satisfactory_percent : 0
                });

                pi_data.series.push({
                    name: "exemplary",
                    value: isFinite(exemplary_percent) ? exemplary_percent : 0
                });

                pi_data.series.forEach(dataset => {
                    if (dataset.value == 0) {
                        dataset.value = 1
                    }
                });

                slo_info.slo_data.push(pi_data);
            }

            this.selectedCourseGraphData.push(slo_info);
        }
    }
}