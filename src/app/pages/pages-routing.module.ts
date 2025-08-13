import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { DetailsComponent } from '../details/details.component';

const routes: Routes = [
   { path: 'Home', component: HomeComponent },
  { path: 'Details/:empId', component: DetailsComponent },
  {path:'Add-Edit', component:AddEditComponent},
  {path:'Add-Edit/:empId', component:AddEditComponent},
  { path: '', redirectTo: '/Home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
