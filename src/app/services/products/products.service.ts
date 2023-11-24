import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');

  /* Configurações HTTP para incluir cabeçalhos necessários, como tipo de conteúdo JSON
   * e token de autorização (JWT). Certifique-se de definir this.JWT_TOKEN antes de usar.
   */
  private httpOptions = {
    headers: new HttpHeaders({
         'Content-Type': 'application/json',
         Authorization: `Bearer ${this.JWT_TOKEN}`,
    })
  }

  constructor(private http: HttpClient, private cookie: CookieService) { }

  /**
 * Função que realiza uma requisição HTTP para obter todos os produtos da API.
 * Retorna uma Observable contendo um array de objetos GetAllProductsResponse,
 * filtrados para incluir apenas aqueles com a propriedade 'amount' maior que zero.
 *
 * @returns Uma Observable<Array<GetAllProductsResponse>> representando os produtos filtrados.
 */

  getAllProducts(): Observable<Array<GetAllProductsResponse>>{
    return this.http.get<Array<GetAllProductsResponse>>(`${this.API_URL}/products`, this.httpOptions)
    .pipe(map((product)=> product.filter((data) => data?.amount > 0)))
  }
}