import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {

  public productsList: Array<GetAllProductsResponse> = [];

  constructor( private productsService: ProductsService, private messsgeService: MessageService){}

  ngOnInit(): void {
     this.getProductsDatas();
  }

  getProductsDatas(): void{
      this.productsService.getAllProducts().subscribe({
        next:(response) =>{
          if(response.length > 0){
             this.productsList = response;
             console.log('Dados do produto', this.productsList);
          }
        },
        error: (err) =>{
          console.log(err);
          this.messsgeService.add({
             severity: 'error',
             summary: 'Erro',
              detail: 'erro ao buscar produtos!',
              life: 2500,
          })
        }
      })
  }
}
