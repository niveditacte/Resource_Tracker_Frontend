import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { AddEditComponent } from "./add-edit/add-edit.component";
import { DetailsComponent } from "./details/details.component";
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { HttpClientService } from './Services/http-client.service';
import { MaincompComponent } from './maincomp/maincomp.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule,MaincompComponent, MatDialogModule, MatButtonModule, MatIconModule, NgSelectModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
 
})
export class AppComponent {

}
