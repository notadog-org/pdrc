import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JWT_TOKEN_KEY } from '../../const';

import { UserResponse, UserLoginRequest, UserRegisterRequest } from '../types';

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  register({
    username,
    password,
  }: UserRegisterRequest): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(`/api/auth/register`, {
        username,
        password,
      })
      .pipe(tap(({ token }) => localStorage.setItem(JWT_TOKEN_KEY, token)));
  }

  login({ username, password }: UserLoginRequest): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(`/api/auth/login`, {
        username,
        password,
      })
      .pipe(tap(({ token }) => localStorage.setItem(JWT_TOKEN_KEY, token)));
  }

  logout() {
    return of(localStorage.removeItem(JWT_TOKEN_KEY));
  }
}
