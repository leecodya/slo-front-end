import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { SLO } from '../../_models/';
import { SLOGraphData } from '../../_models/graph-data';
import { AlertService, SLOService, GraphDataService } from '../../_services/';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-slo-reports',
  templateUrl: './slo-reports.component.html',
  styleUrls: ['./slo-reports.component.sass']
})

export class SLOReportsComponent implements OnInit {
    slos: SLO[];    
    formLoading: Boolean = false;
    selectedSLOId: String;
    selectedSLO: SLO;
    selectedSLOGraphData = null; // Holds both Online/F2F info
    selectedSLOF2FGraphData = null; //Just F2F Info
    selectedSLOONLINEGraphData = null; // Just ONLINE Info
    componentLoading: Boolean = true;

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
        private graphDataService: GraphDataService,
        private sloService: SLOService
    ) { }

    ngOnInit() {
        this.componentLoading = true;
        this.sloService.getSLOS().subscribe(
            data => {
                this.slos = data;
                
                if (this.slos.length > 0) {
                    this.selectedSLO = this.slos[0];
                    this.loadSLO(this.selectedSLO);
                    this.selectedSLOId = this.slos[0].slo_id;
                } else {
                    this.selectedSLO = new SLO(); // initialize with empty course
                }

                this.componentLoading = false;
            },
            error => {
                console.log(error);
                this.componentLoading = false;
            }
        )
        
    }

    loadSelectedSLO(event: Event) {
        let slo_id = (<HTMLInputElement>event.target).value;
        this.selectedSLO = this.slos.find(x => x.slo_id == slo_id);
        this.loadSLO(this.selectedSLO);
    }

    loadSLO(slo: SLO) {
        this.formLoading = true;
        let sloRequests = [
            this.graphDataService.getSLOData(slo),
            this.graphDataService.getSLOData(slo, "F2F"),
            this.graphDataService.getSLOData(slo, "ONLINE")
        ];

        Observable.forkJoin(sloRequests).subscribe(
            slo_data => {
                this.selectedSLO.total_assessments = slo_data[0].total_assessments;
                this.selectedSLOGraphData = this.processData(slo_data[0]);
                this.selectedSLOF2FGraphData = this.processData(slo_data[1]);
                this.selectedSLOONLINEGraphData = this.processData(slo_data[2]);
                this.formLoading = false;
            },
            error => {
                console.log(error);
                this.formLoading = false;
            }
        );
    }

    //massage CourseGraphData into data expected by ngx-charts. Also convert from values to percentages
    processData(slo: SLOGraphData) {
        let slo_info = {
            slo_id: slo.slo_id,
            slo_description: slo.slo_description,
            slo_data: []
        };
            
        for (let pi of slo.performance_indicators) {
            let pi_data = {
                name: pi.performance_indicator_description,
                series: []
            };

            let unsatisfactory_percent = Math.round((pi.unsatisfactory / slo.total_assessments) * 100);
            let developing_percent = Math.round((pi.developing / slo.total_assessments) * 100);
            let satisfactory_percent = Math.round((pi.satisfactory / slo.total_assessments) * 100);
            let exemplary_percent = Math.round((pi.exemplary / slo.total_assessments) * 100);

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
                    dataset.value = 1 // Make 0's 1s. Helps visualize empty bars
                }
            });

            slo_info.slo_data.push(pi_data);
        }

        return slo_info;
    }


}