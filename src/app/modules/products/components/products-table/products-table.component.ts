import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductsEvent } from 'src/app/models/enums/products/ProductsEvent';
import { DeleteProductAction } from 'src/app/models/interfaces/products/event/DeleteProductAction';
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
  @Output()  deleteProductEvent = new EventEmitter<DeleteProductAction>();

  public productSelected!: GetAllProductsResponse;

  public addProductEvent = ProductsEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductsEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: string, id?: string): void{
     if(action && action !== ''){
         const productEventData = id && id != '' ? {action, id} : {action};
         this.productEvent.emit(productEventData);
     }
  }

  handlerDeleteProduct(product_id: string, productName: string): void{
      if(product_id!== '' && productName!==''){
                this.deleteProductEvent.emit({
                  product_id, productName
                })
      }
  }

}
