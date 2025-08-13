import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../../app.routes';
import { AppComponent } from '../../app.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginValue = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.loginValue, this.password).subscribe({
      next: (res) => {
        console.log(res);

        if (res && res.token) {
          localStorage.setItem('token', res.token);
          console.log(this.authService.getUserRole());
          this.router.navigate(['/Home']);

        }
        else {
          this.errorMessage = 'Invalid username/email or password.';
        }
      },
      error: (err) => {
        console.error(err);
        (this.errorMessage = "Invalid username/email or password.")
      }
    });
  }

}
