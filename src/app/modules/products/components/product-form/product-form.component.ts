import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ProductsEvent } from 'src/app/models/enums/products/ProductsEvent';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/createProductRequest';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

import { GetAllProductsResponse } from './../../../../models/interfaces/products/response/GetAllProductsResponse';
import { CategoriesService } from './../../../../services/categories/categories.service';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

    public categoriesDatas: Array<GetCategoriesResponse> = [];
    public selectedCategory: Array<{name: string; code: string}> = []
    public renderDropdown = false;


    public productAction!:{
      event: EventAction;
      productDatas: Array<GetAllProductsResponse>;
    }

    public productSelectedDatas!: GetAllProductsResponse;
    public productsDatas: Array<GetAllProductsResponse> = [];

    private readonly destroy$: Subject<void> = new Subject();

    constructor(
      private categoriesService:CategoriesService,
      private  productsDtService: ProductsDataTransferService,
       private formBuilder: FormBuilder,
       private messageService: MessageService,
       private router: Router,
       private productsService: ProductsService,
       private ref: DynamicDialogConfig
       ){}

       public addProductForm = this.formBuilder.group({
            name:['', Validators.required],
            price: ['', Validators.required],
            description: ['', Validators.required],
            category_id: ['', Validators.required],
            amount: [0, Validators.required]
       });

       public editProductFrom = this.formBuilder.group({
        name:['', Validators.required],
        price: ['', Validators.required],
        description: ['', Validators.required],
        amount: [0, Validators.required],
        category_id: ['', Validators.required]
   });

   public addProductAction = ProductsEvent.ADD_PRODUCT_EVENT;
   public editProductAction = ProductsEvent.EDIT_PRODUCT_EVENT;
   public saleProductAction = ProductsEvent.SALE_PRODUCT_EVENT;

  ngOnInit(): void {
    this.productAction = this.ref.data;


    this.productAction?.event?.action === this.saleProductAction && this.getAllCategories();

    this.getAllCategories();
    this.renderDropdown = true;
  }

  ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
  }

  getAllCategories(): void{
    this.categoriesService.getAllCategories().pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response)=>{
         if(response.length > 0){
          this.categoriesDatas = response;

          if(this.productAction?.event?.action === this.editProductAction && this.productAction?.productDatas){
            this.getProductSelectedDatas(this.productAction?.event?.id as string);
          }

         }
      }
    })
  }


  handleSubmitAddProduct(): void {
    if (this.addProductForm.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
         name: this.addProductForm.value.name as string,
         price: this.addProductForm.value.price as string,
         description: this.addProductForm.value.description as string,
         category_id: this.addProductForm.value.category_id as string,
         amount: Number(this.addProductForm.value.amount),
      };

      this.productsService.createProduct(requestCreateProduct).pipe(takeUntil(this.destroy$)).subscribe(
        {
              next:(response)=>{
                if(response){
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Producto criadp com sucesso!',
                    life: 2500,
                  });
                }
              },
              error: (err) =>{
                console.log(err);
                this.messageService.add({
                  severity: 'error',
                  summary: ' Erro',
                  detail: 'Erro ao criar Producto!',
                  life: 2500
                });
            },
        });

     }
     this.addProductForm.reset();
 }

 handleSubmitEditProduct(): void{

  if(this.editProductFrom.value && this.editProductFrom.valid && this.productAction.event.id){
     const requestEditProduct: EditProductRequest={
         name: this.editProductFrom.value.name as string,
         price: this.editProductFrom.value.price as string,
         description: this.editProductFrom.value.description as string,
         product_id: this.productAction?.event?.id,
         amount: this.editProductFrom.value.amount as number,
         category_id: this.editProductFrom.value.category_id as string,
     };
       this.productsService.editProduct(requestEditProduct).pipe(takeUntil(this.destroy$)).subscribe({
         next:(response) =>{
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto editado com sucesso',
              life: 2500,
            });
            this.editProductFrom.reset();
         }, error: (err) =>{
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao editadar Produto',
            life: 2500,
          });
          this.editProductFrom.reset();
         }
       })
    }
 }

 getProductSelectedDatas(productId: string): void{
       const allProducts = this.productAction?.productDatas;

       if(allProducts.length > 0){
         const productsFiltered = allProducts.filter(
          (element) => element?.id === productId
         );

         if(productsFiltered){
            this.productSelectedDatas = productsFiltered[0];

            this.editProductFrom.setValue({
               name: this.productSelectedDatas?.name,
               price: this.productSelectedDatas?.price,
               amount: this.productSelectedDatas?.amount,
               description: this.productSelectedDatas?.description,
               category_id: this.productSelectedDatas?.category?.id,
            })
         }
        }
 }

 getProductData(): void{
     this.productsService.getAllProducts()
     .pipe(takeUntil(this.destroy$))
     .subscribe({
      next: (response) =>{
        if(response.length > 0){
            this.productsDtService.setProductsData(this.productsDatas);
        }
      }
     })
 }

}
