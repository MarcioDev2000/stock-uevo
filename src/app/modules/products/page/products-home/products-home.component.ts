import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

 handlerProductAction(event: EventAction): void{
        if(event){
          console.log('Dados do Evento Recebido', event);
        }
 }

 handlerDeleteProductAction(event: {product_id:string, productName:string}): void{
             if(event){
                 this.confirmationService.confirm({
                   message: `Confirma a exclusão do produto: ${event?.productName}`,
                   header: 'Confrmação de exclusão',
                   icon: 'pi pi-exclamation-triangle',
                   acceptLabel: 'sim',
                   rejectLabel: 'Não',
                   accept: () => this.deleteProduct(event?.product_id),
                 })
             }
 }

 deleteProduct(product_id: string){
       if(product_id){
         this.productsService.deleteProducts(product_id).pipe(takeUntil(this.destroy$))
         .subscribe({
          next: (response) =>{
            if(response){
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto removido com sucesso',
                life: 2500,
              }),
              this.getAPIProductsDatas();
            }
          },
          error:(err) =>{
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover produto',
              life:2500
            })
          }
         })
       }
 }













  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }


}
