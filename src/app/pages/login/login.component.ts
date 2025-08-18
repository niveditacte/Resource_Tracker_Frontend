import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../../app.routes';
import { AppComponent } from '../../app.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, InputsModule, ButtonsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginValue = '';
  password = '';
  errorMessage = '';
  rememberMe: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const savedLogin = localStorage.getItem('savedLogin');
    if (savedLogin) {
      this.loginValue = savedLogin;
      this.rememberMe = true;
    }
  }

  onLogin() {
    if (this.rememberMe) {
      localStorage.setItem('savedLogin', this.loginValue);
    } else {
      localStorage.removeItem('savedLogin');
    }

    this.authService.login(this.loginValue, this.password).subscribe({
      next: (res) => {
        console.log(res);

        if (res && res.token) {
          localStorage.setItem('token', res.token);
          console.log(this.authService.getUserRole());
          this.router.navigate(['/Home']);
          alert('Login successful!');
          

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
