import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { AddEditComponent } from './add-edit/add-edit.component';

export const routes: Routes = [
    {path:"Home",component: HomeComponent},
    {path:"Details/:empId",component:DetailsComponent},
    {path:"Add-Edit", component: AddEditComponent},
    { path: "Add-Edit/:empId",component: AddEditComponent},
    {path:"",redirectTo:"/Home",pathMatch:"full"},
    {path:"**",redirectTo:"/Home",pathMatch:"full"}

];
