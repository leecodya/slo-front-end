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