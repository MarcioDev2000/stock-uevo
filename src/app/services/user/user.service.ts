import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUSerResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private api_url = environment.API_URL;

  constructor(private http: HttpClient, private route: Router) { }

  //Criar os dados do Usuario
  signupUser(requestDatas: SignupUserRequest): Observable<SignupUSerResponse>{
     return this.http.post<SignupUSerResponse>(`${this.api_url}/user`, requestDatas);

  }

//Metodo de autenticação de usuario
authUSer(requestDatas: AuthRequest): Observable<AuthResponse>{
  return this.http.post<AuthResponse>(`${this.api_url}/auth`, requestDatas)
}

}
