import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { AddEditComponent } from "./add-edit/add-edit.component";
import { DetailsComponent } from "./details/details.component";
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { HttpClientService } from './Services/http-client.service';
import { MaincompComponent } from './maincomp/maincomp.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './Services/auth.interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routes';
import { LoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, RouterOutlet, MaincompComponent, MatDialogModule, MatButtonModule, MatIconModule, NgSelectModule, FormsModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'

})

export class AppComponent {
  title = 'Resource_Tracker';

}
