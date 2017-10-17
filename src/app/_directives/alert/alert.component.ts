import { Component, OnInit } from '@angular/core';

import { AlertService } from '../../_services/';

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['alert.component.sass']
})

export class AlertComponent implements OnInit {
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => {
            this.message = message; 
            setTimeout(() => {
                this.message = '';
            }, 10000);
        });
    }
}