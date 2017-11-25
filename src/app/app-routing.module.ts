import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { RegisterComponent } from './register/register.component';
import { SLOComponent } from './slo/slo.component';
import { EditSLOComponent } from './edit-slo/edit-slo.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AuthGuard } from './_guards/auth.guard';
import { AdminAuthGuard } from './_guards/admin-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'assessment/:crn',
    component: AssessmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'slos',
    component: SLOComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'slo/:slo_id',
    component: EditSLOComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
