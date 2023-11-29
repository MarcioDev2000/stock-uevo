import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: ['./products-home.component.scss']
})
export class ProductsHomeComponent implements OnInit, OnDestroy  {

  private destroy$ = new Subject<void>();
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService, 
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService
    ){}
  
  ngOnInit(): void {
      this.getServiceProductsDatas();
  }

 getServiceProductsDatas(){
    const productsLoaded = this.productsDtService.getProductsData();

    if(productsLoaded.length > 0){
           this.productsDatas = productsLoaded;
           console.log('Dados', this.productsDatas);
    }
    else{
            this.getAPIProductsDatas();
    }
 }

 getAPIProductsDatas(){
   this.productsService.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe({
     next: (response) =>{
        if(response.length > 0){
           this.productsDatas = response;
        }
     },
     error: (err) =>{
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar Produtos',
          life:2500
        })
        this.router.navigate(['/dashboard']);
     }
   })
 }














  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }


}
