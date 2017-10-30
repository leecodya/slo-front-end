import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AlertComponent } from './_directives/alert/alert.component';
import { MenuComponent } from './_directives/menu/menu.component';

import { AuthGuard } from './_guards/auth.guard';
import { AdminAuthGuard } from './_guards/admin-auth.guard';
import { AuthenticationService, HelperService, FacultyService, AlertService, CourseService, SLOService, StudentService, AssessmentService } from './_services/';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { AddStudentsComponent } from './assessment/add-students/add-students.component';
import { AssessStudentsComponent } from './assessment/assess-students/assess-students.component';
import { LeaveCommentsComponent } from './assessment/leave-comments/leave-comments.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    MenuComponent,
    HomeComponent,
    LoginComponent,
    AssessmentComponent,
    RegisterComponent,
    AddStudentsComponent,
    AssessStudentsComponent,
    LeaveCommentsComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    AdminAuthGuard,
    AlertService,
    FacultyService,
    AuthenticationService,
    CourseService,
    SLOService,
    StudentService,
    AssessmentService,
    HelperService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
