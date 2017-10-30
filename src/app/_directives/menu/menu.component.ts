import { Component, OnInit } from '@angular/core';
import { Faculty } from '../../_models/';
import { FacultyService } from '../../_services/';

@Component({
    selector: 'menu-bar',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.sass']
})

export class MenuComponent implements OnInit {
    user: Faculty = new Faculty({ user_type: "0" });

    constructor(private facultyService: FacultyService) { }

    ngOnInit() {
        this.facultyService.getUserInfo().subscribe(
            data => this.user = data,
            error => console.log(error)
        );
    }
}
