import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Course, Faculty, SLO, Student } from '../_models/';
import { HelperService } from './helper.service';
import { environment } from '../../environments/environment';


@Injectable()
export class SLOService {
    _baseURL: string = environment.api;

    constructor(
        private http: Http,
        private helperService: HelperService
    ) { }

    getSLOS() {
        return this.http.get(this._baseURL + '/slos', this.helperService.jwt()).map((res: Response) => {
            let slos: SLO[] = [];
            let sloData = res.json();

            for (let slo of sloData) {
                slos.push(new SLO(slo));
            }

            return slos;
        });
    }

    getSLO(slo: SLO) {
        return this.http.get(this._baseURL + `/slo/${slo.slo_id}`, this.helperService.jwt()).map((res: Response) => {
            return new SLO(res.json());
        });
    }

    createSLO(slo: SLO) {
        let slo_data = {
            slo_id: slo.slo_id,
            slo_description: slo.slo_description,
            performance_indicators: slo.performance_indicators.map(x => {
                x.performance_indicator_id = slo.slo_id + "-" + x.performance_indicator_id.toString();
                return x;
            })
        }

        return this.http.post(this._baseURL + '/slos', slo_data, this.helperService.jwt()).map((res: Response) => {
            return new SLO(res.json());
        });
    }

    updateSLO(slo: SLO) {
        let slo_data = {
            slo_id: slo.slo_id,
            slo_description: slo.slo_description,
            performance_indicators: slo.performance_indicators.map(x => {
                x.performance_indicator_id = slo.slo_id + "-" + x.performance_indicator_id.toString();
                return x;
            })
        }

        return this.http.put(this._baseURL + `/slo/${slo.slo_id}`, slo_data, this.helperService.jwt()).map((res: Response) => {
            return new SLO(res.json());
        });
    }

    getReport(report_type, year) {
        console.log(report_type);
        if (report_type !== 'courses' && report_type !== 'slos') {
            throw new TypeError("report_type must be courses or slos");
        }

        let query_string = year ? `?year=${year}` : '';
        return this.http.get(this._baseURL + '/report/' + report_type + query_string, this.helperService.jwt()).map((res: Response) => {
            let data = res.json();
            return { file_url: this._baseURL + data.file_url };
        });
    }
}