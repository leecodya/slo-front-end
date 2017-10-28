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
}