import { animation } from '@angular/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard';
import { RoleGuard } from './auth/role-guard';
import { LoginComponent } from './login/login.component';
import { AdminBeveragesComponent } from './main/admin-beverages/admin-beverages.component';
import { BeverageDetailComponent } from './main/admin-beverages/beverage-detail/beverage-detail.component';
import { AdminCodesComponent } from './main/admin-codes/admin-codes.component';
import { CodeDetailComponent } from './main/admin-codes/code-detail/code-detail.component';
import { AdminProfileComponent } from './main/admin-profile/admin-profile.component';
import { AdminWaitersComponent } from './main/admin-waiters/admin-waiters.component';
import { HomeComponent } from './main/home/home.component';
import { MainComponent } from './main/main.component';
import { OrderDetailsComponent } from './main/orders/order-details/order-details.component';
import { OrdersComponent } from './main/orders/orders.component';
import { ProfileComponent } from './main/profile/profile.component';
import { RankingsComponent } from './main/rankings/rankings.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { animation: 'top' } },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { animation: 'bottom', role: 'Member' },
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    data: { animation: 'main' },
    children: [
      {
        path: 'user',
        canActivate: [RoleGuard],
        data: { role: 'User' },
        children: [
          {
            path: 'home',
            component: HomeComponent,
            data: { animation: '1' },
            outlet: 'main-page',
          },
          {
            path: 'orders',
            component: OrdersComponent,
            data: { animation: '2' },
            outlet: 'main-page',
          },
          {
            path: 'rankings',
            component: RankingsComponent,
            data: { animation: '3' },
            outlet: 'main-page',
          },
          {
            path: 'profile',
            component: ProfileComponent,
            data: { animation: '4' },
            outlet: 'main-page',
          },
        ],
      },
      {
        path: 'creator',
        canActivate: [RoleGuard],
        data: { role: 'Creator' },
        children: [
          {
            path: 'codes',
            component: AdminCodesComponent,
            data: { animation: '1' },
            outlet: 'main-page',
          },

          {
            path: 'beverages',
            component: AdminBeveragesComponent,
            data: { animation: '2' },
            outlet: 'main-page',
          },
          {
            path: 'waiters',
            component: AdminWaitersComponent,
            data: { animation: '3' },
            outlet: 'main-page',
          },
          {
            path: 'maps',
            component: AdminProfileComponent,
            data: { animation: '4' },
            outlet: 'main-page',
          },
        ],
      },
    ],
  },
  {
    path: 'edit',
    canActivate: [AuthGuard],
    data: { animation: 'edit' },
    children: [
      {
        path: 'creator',
        canActivate: [RoleGuard],
        data: { role: 'Creator' },
        children: [
          {
            path: 'code',
            component: CodeDetailComponent,
          },
          {
            path: 'beverage',
            component: BeverageDetailComponent,
          },
        ],
      },
      {
        path: 'user',
        canActivate: [RoleGuard],
        data: { role: 'User' },
        children: [
          {
            path: 'order',
            component: OrderDetailsComponent,
          },
        ],
      },
    ],
  },

  // MAIN PAGE ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
