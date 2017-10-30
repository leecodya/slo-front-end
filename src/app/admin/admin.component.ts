import { Component, OnInit } from '@angular/core';
import { SLOService, AlertService } from './../_services/';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {
  reportLoading: Boolean = false;
  file_url: String = "";

  constructor(
    private sloService: SLOService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  generateReport() {
    this.reportLoading = true;
    this.sloService.getReport().subscribe(
      data => {
        this.file_url = data.file_url;
        console.log(this.file_url);
        this.reportLoading = false;
      },
      error => {
        console.log(error);
        this.reportLoading = false;
      }
    );
  }
}
