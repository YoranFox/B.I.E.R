import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { 
  AuthGuardService as AuthGuard 
} from './auth/auth-guard.service';
import { ChangePasswordComponent } from './edit/change-password/change-password.component';
import { CreateSpaceComponent } from './edit/create-space/create-space.component';
import { LiveCamComponent } from './live-cam/live-cam.component';

const routes: Routes = [
  {path: '', redirectTo:'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {
    path: 'home', 
    component: HomePageComponent,
    canActivate: [AuthGuard],
    data: { roles: ['user','admin'] }
  },
  { 
    path: 'edit',
    component: EditComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'edit/change-password', 
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'edit/create-space', 
    component: CreateSpaceComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'live', 
    component: LiveCamComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}