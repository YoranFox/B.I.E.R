import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SpaceBuilderComponent } from './space-builder/space-builder.component';
import { RequestBeverageComponent } from './request-beverage/request-beverage.component';
import { SpaceComponent } from './space/space.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EditComponent } from './edit/edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { HttpClientModule } from '@angular/common/http';
import { ChangePasswordComponent } from './edit/change-password/change-password.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { ApiModule } from './_sdk/api.module';
import { environment } from 'src/environments/environment';
import { CreateSpaceComponent } from './edit/create-space/create-space.component';
import { HeaderService } from './shared/header/header.service';
import { LiveCamComponent } from './live-cam/live-cam.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SpaceBuilderComponent,
    RequestBeverageComponent,
    SpaceComponent,
    LoginComponent,
    EditComponent,
    ChangePasswordComponent,
    FooterComponent,
    HeaderComponent,
    CreateSpaceComponent,
    LiveCamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    ApiModule.forRoot({rootUrl: environment.apiRootUrl})
  ],
  providers: [HeaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
