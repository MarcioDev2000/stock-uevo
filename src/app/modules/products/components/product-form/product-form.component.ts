import { FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './../../../../services/categories/categories.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetCategoriesResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/createProductRequest';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

    public categoriesDatas: Array<GetCategoriesResponse> = [];
    public selectedCategory: Array<{name: string; code: string}> = []

    private readonly destroy$: Subject<void> = new Subject();

    constructor(
      private categoriesService:CategoriesService,
       private formBuilder: FormBuilder,
       private messageService: MessageService,
       private router: Router,
       private productsService: ProductsService
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
        amount: [0, Validators.required]
   });

  ngOnInit(): void {
    this.getAllCategories();
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
    
 }

}
