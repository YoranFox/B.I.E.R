import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './main/home/home.component';
import { MainComponent } from './main/main.component';
import { OrdersComponent } from './main/orders/orders.component';
import { ProfileComponent } from './main/profile/profile.component';
import { RankingsComponent } from './main/rankings/rankings.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { animation: 'top' } },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [AuthGuard],
    data: { animation: 'bottom' },
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    data: { animation: 'main' },
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {animation: '1'},
        outlet: 'main-page'
      },
      {
        path: 'orders',
        component: OrdersComponent,
        data: {animation: '2'},
        outlet: 'main-page'
      },
      {
        path: 'rankings',
        component: RankingsComponent,
        data: {animation: '3'},
        outlet: 'main-page'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {animation: '4'},
        outlet: 'main-page'
      }
    ]
  },

  // MAIN PAGE ROUTES


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
