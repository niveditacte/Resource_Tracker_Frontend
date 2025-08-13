import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private ServerURI = environment.apiBaseUrl;
    private jwtHelper = new JwtHelperService();

    constructor(private http: HttpClient, private router: Router) { }
    login(emailorUsername: string, password: string): Observable<any> {
        return this.http.post(`${this.ServerURI}/login`, { emailorUsername, password }, { headers: { 'Content-Type': 'application/json' } });
    }

    register(username: string, email: string, password: string, roleId:number): Observable<any> {
        return this.http.post(`${this.ServerURI}/register`, { username, email, password, roleId });
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getUserRole(): string | null {
        const token = this.getToken();
        if (!token) return null;
        const decoded = this.jwtHelper.decodeToken(token);
        console.log(decoded);
        return decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;;
    }
}