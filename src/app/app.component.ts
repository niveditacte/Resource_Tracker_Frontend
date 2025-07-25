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
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule,MaincompComponent, MatDialogModule, MatButtonModule, MatIconModule, MatChipsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
 
})
export class AppComponent {

}
