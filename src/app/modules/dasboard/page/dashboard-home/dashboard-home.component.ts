// Importa os módulos e serviços necessários
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api'; // Módulo de mensagens do PrimeNG
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

// Componente Angular
@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, OnDestroy{
     private destroy$ = new Subject<void>();
     public productsList: Array<GetAllProductsResponse> = []; // Propriedade para armazenar os dados dos produtos


     public productsChartDatas!: ChartData;
     public productsChartOptions!: ChartOptions;
  // Construtor do componente, recebe instâncias de serviços
  constructor(
    private productsService: ProductsService, // Serviço para obter dados dos produtos
    private messageService: MessageService, // Serviço para exibir mensagens
    private productsDtService: ProductsDataTransferService // Serviço para transferir dados dos produtos
  ) {}

  // Método chamado automaticamente durante a inicialização do componente
  ngOnInit(): void {
     this.getProductsDatas(); // Chama o método para obter dados dos produtos
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  // Método para obter dados dos produtos
  getProductsDatas(): void {
    // Usa o serviço ProductsService para obter todos os produtos
    this.productsService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => { // Lida com a resposta bem-sucedida
        if (response.length > 0) { // Se houver produtos na resposta
          this.productsList = response; // Atualiza a lista de produtos no componente
          console.log('Dados do produto', this.productsList);

          // Chama o método do serviço ProductsDataTransferService para transferir os dados para outros componentes
          this.productsDtService.setProductsData(this.productsList);
          this.setProductsChartConfig();
        }
      },
      error: (err) => { // Lida com erros durante a obtenção de dados
        console.log(err);
        // Exibe uma mensagem de erro usando o serviço MessageService
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produtos!',
          life: 2500, // Tempo de vida da mensagem em milissegundos
        });
      }
    });
  }

  setProductsChartConfig(): void {
    if (this.productsList.length > 0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--text-color-secondary'
      );
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.productsChartDatas = {
        labels: this.productsList.map((element) => element?.name),
        datasets: [
          {
            label: 'Quantidade',
            backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
            borderColor: documentStyle.getPropertyValue('--indigo-400'),
            hoverBackgroundColor:
              documentStyle.getPropertyValue('--indigo-500'),
            data: this.productsList.map((element) => element?.amount),
          },
        ],
      };

      this.productsChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },

        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: '500',
              },
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
    }
  }
}
