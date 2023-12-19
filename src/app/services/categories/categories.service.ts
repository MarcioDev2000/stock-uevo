import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetCategoriesResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private cookie: CookieService) { }

  private jWT_TOKEN = this.cookie.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
         'Content-Type': 'application/json',
         Authorization: `Bearer ${this.jWT_TOKEN}`,
    })
  }


  getAllCategories(): Observable<Array<GetCategoriesResponse>>{
    return this.http.get<Array<GetCategoriesResponse>>(`${this.API_URL}/categories`, this.httpOptions);
  }

}
