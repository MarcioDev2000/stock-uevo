import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductsEvent } from 'src/app/models/enums/products/ProductsEvent';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent {

  @Input() products: Array<GetAllProductsResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>();

  public productSelected!: GetAllProductsResponse;

  public addProductEvent = ProductsEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductsEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: string, id?: string): void{
     if(action && action !== ''){
         const productEventData = id && id != '' ? {action, id} : {action};
         this.productEvent.emit(productEventData);
     }
  }

}
