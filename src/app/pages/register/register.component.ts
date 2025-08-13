import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { HttpClientService } from '../../Services/http-client.service';
import { Router } from '@angular/router';
import { Role } from '../../interfaces';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  
  registerform!: FormGroup;
  message = '';
  errorMessage = '';
  roles: Role[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private httpClientService: HttpClientService,
    private router: Router
  ) { }

  ngOnInit() {
    console.log(this.authService.getUserRole());
    this.registerform = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roleId: [null, Validators.required]

    });

    this.httpClientService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        console.log("roles", this.roles);
      },
      error: (err) => {
        console.error("Error in fetching roles", err);
      }
    });
  }

  onRegister() {
    if (this.registerform.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    const { username, email, password, roleId } = this.registerform.value;

    this.authService.register(username, email, password, roleId).subscribe({
      next: (res) => {
        console.log(res);
        this.message = res.message;
        this.errorMessage = '';
        this.registerform.reset();
        alert('User registered successfully!'); 
        this.router.navigate(['/Home']);
      },
      error: (err) => {
        console.log(err);

        this.errorMessage = 'Failed to register user.'
      }
    });
  }
}


