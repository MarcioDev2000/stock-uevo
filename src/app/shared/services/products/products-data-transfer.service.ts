import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {

   // Cria um BehaviorSubject que emite um array de GetAllProductsResponse ou null
  public productsDataEmitter$ = new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);


  // Cria um array de GetAllProductsResponse vazio
  public productsDatas: Array<GetAllProductsResponse> = [];

   // Método para definir os dados dos produtos
  setProductsData(products: Array<GetAllProductsResponse>):void{
     if(products){
      //Emite os dados para os observadores
       this.productsDataEmitter$.next(products);

       // Chama o método getProductsData()
       this.getProductsData();
     }
  }

  // Método para obter os dados dos produtos
  getProductsData(){

    // Utiliza operadores do RxJS para manipular o fluxo do BehaviorSubject
     this.productsDataEmitter$.pipe(
      // Pega apenas o primeiro valor emitido pelo BehaviorSubject
       take(1),
       // Filtra os produtos com quantidade maior que zero
       map((data) => data?.filter((products) => products.amount > 0)
       )
     )
      // Inscreve-se para receber notificações quando os dados mudarem
     .subscribe({
      // Lida com o próximo valor emitido
       next: (response) =>{
         if(response){
            // Atualiza o array de produtos com os dados filtrados
          this.productsDatas = response;
         }
       },
     });
         // Retorna o array de produtos (pode não estar totalmente atualizado)
     return this.productsDatas;
  }

}
