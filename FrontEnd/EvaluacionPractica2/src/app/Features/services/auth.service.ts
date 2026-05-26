import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';
import {
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
} from '../../Core/constants/app.constants';
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly loginUrl = `${environment.apiUrl}/auth/login`;
  private readonly meUrl = `${environment.apiUrl}/auth/me`;
  private readonly refreshUrl = `${environment.apiUrl}/auth/refresh`;

  readonly currentUser = signal<AuthUser | null>(this.loadUserFromStorage());

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap((response) => {
        this.persistSession(response, credentials.username);
      }),
    );
  }

  getCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(this.meUrl).pipe(
      tap((user) => {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      }),
    );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);

    return this.http.post<RefreshTokenResponse>(this.refreshUrl, { refreshToken }).pipe(
      tap((response) => {
        const token = response.accessToken || response.token;
        if (token) {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
        }
        if (response.refreshToken) {
          localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, response.refreshToken);
        }
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getSessionSummary(): { token: string | null; user: AuthUser | null } {
    return {
      token: this.getToken(),
      user: this.currentUser(),
    };
  }

  private loadUserFromStorage(): AuthUser | null {
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    if (!userJson) {
      return null;
    }

    try {
      return JSON.parse(userJson) as AuthUser;
    } catch {
      return null;
    }
  }

  private persistSession(response: LoginResponse, fallbackUsername: string): void {
    const token = response.accessToken || response.token;
    if (!token) {
      throw new Error('La API no devolvio un token de autenticacion.');
    }

    const user: AuthUser = {
      id: Number(response.id ?? 0),
      username: response.username ?? fallbackUsername,
      email: response.email ?? `${fallbackUsername}@novamarket.local`,
      firstName: response.firstName ?? 'Admin',
      lastName: response.lastName ?? 'NovaMarket',
      image:
        response.image ??
        'https://dummyapi.codesmash.in/image?text=NM&width=96&height=96',
    };

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    if (response.refreshToken) {
      localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, response.refreshToken);
    }
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }
}
