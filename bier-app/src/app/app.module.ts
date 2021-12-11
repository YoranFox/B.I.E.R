import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ApiModule } from './_sdk/api.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './auth/token.interceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainComponent } from './main/main.component';
import { AuthService } from './auth/auth.service';
import { SessionsService } from './shared/services/sessions.service';
import { HomeComponent } from './main/home/home.component';
import { RankingsComponent } from './main/rankings/rankings.component';
import { ProfileComponent } from './main/profile/profile.component';
import { TopNavComponent } from './shared/components/top-nav/top-nav.component';
import { BottomNavComponent } from './shared/components/bottom-nav/bottom-nav.component';
import { AuthGuard } from './auth/auth-guard';
import { RoleGuard } from './auth/role-guard';
import { OrdersComponent } from './main/orders/orders.component';
import { AdminCodesComponent } from './main/admin-codes/admin-codes.component';
import { AdminBeveragesComponent } from './main/admin-beverages/admin-beverages.component';
import { AdminWaitersComponent } from './main/admin-waiters/admin-waiters.component';
import { AdminProfileComponent } from './main/admin-profile/admin-profile.component';
import { CodeDetailComponent } from './main/admin-codes/code-detail/code-detail.component';
import { BeverageDetailComponent } from './main/admin-beverages/beverage-detail/beverage-detail.component';
import { BeverageListModalComponent } from './shared/modals/beverage-list-modal/beverage-list-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailsComponent } from './main/orders/order-details/order-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    MainComponent,
    HomeComponent,
    RankingsComponent,
    ProfileComponent,
    TopNavComponent,
    BottomNavComponent,
    OrdersComponent,
    AdminCodesComponent,
    AdminBeveragesComponent,
    AdminWaitersComponent,
    AdminProfileComponent,
    CodeDetailComponent,
    BeverageDetailComponent,
    BeverageListModalComponent,
    OrderDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    ApiModule.forRoot({ rootUrl: environment.apiBaseUrl }),
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    AuthGuard,
    RoleGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
