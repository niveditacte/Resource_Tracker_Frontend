import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailsComponent } from './details/details.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './pages/register/register.component';
import { authGuardGuard } from './guards/auth-guard.guard';
import { roleGuardGuard } from './guards/role-guard.guard';
import { MaincompComponent } from './maincomp/maincomp.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: "", redirectTo: "/Home", pathMatch: "full" },
    {
        path: '', component: MaincompComponent, canActivate: [authGuardGuard],
        children: [
            { path: "Home", component: HomeComponent, canActivate: [authGuardGuard, roleGuardGuard], data: { role: ['Admin', 'Manager', 'User', 'HR'] } },
            { path: "Details/:empId", component: DetailsComponent, canActivate: [authGuardGuard, roleGuardGuard], data: { role: ['Admin', 'Manager', 'HR', 'User'] }  } ,
            { path: "Add-Edit", component: AddEditComponent, canActivate: [authGuardGuard, roleGuardGuard], data: { role: ['Admin', 'Manager'] } },
            { path: "Add-Edit/:empId", component: AddEditComponent, canActivate: [authGuardGuard, roleGuardGuard], data: { role: ['Admin', 'Manager'] } },
            { path: 'register', component: RegisterComponent, canActivate: [authGuardGuard, roleGuardGuard], data: { role: ['Admin'] } },

        ]
    },
    // { path: '', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [authGuardGuard] },
    { path: "**", redirectTo: "/Home", pathMatch: "full" }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
