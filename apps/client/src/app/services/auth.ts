import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { UserResponse, UserLoginRequest, UserRegisterRequest } from '../types';

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  register({
    username,
    password,
  }: UserRegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      `${environment.apiHost}/api/auth/register`,
      {
        username,
        password,
      }
    );
  }

  login({ username, password }: UserLoginRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      `${environment.apiHost}/api/auth/login`,
      {
        username,
        password,
      }
    );
  }
}
