import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/createProductRequest';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { CreateProductResponse } from 'src/app/models/interfaces/products/response/CreateProductResponse';
import { DeleteProductsResponse } from 'src/app/models/interfaces/products/response/DeleteProductResponse';
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

  // Apenas vai mostrar produtos que a quantidade é maior que zero.
  getAllProducts(): Observable<Array<GetAllProductsResponse>>{
    return this.http.get<Array<GetAllProductsResponse>>(`${this.API_URL}/products`, this.httpOptions)
    .pipe(map((product)=> product.filter((data) => data?.amount > 0)))
  }


  deleteProducts(product_id: string): Observable<DeleteProductsResponse>{
      return this.http.delete<DeleteProductsResponse>(
        `${this.API_URL}/product/delete`,
        {
         ...this.httpOptions, params:{
              product_id: product_id
         }
        }
      )
  }

  createProduct(requestDatas: CreateProductRequest): Observable<CreateProductResponse>{
      return this.http.post<CreateProductResponse>(`${this.API_URL}/product`, requestDatas, this.httpOptions);
  }

  editProduct(requestDatas: EditProductRequest):Observable<void>{
     return this.http.put<void>(`${this.API_URL}/product/edit`, requestDatas, this.httpOptions)
  }


}
