import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';



interface Order {
  itemid: string;
  storeid: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  orders = [];
  orderObj = {} as Order;

  private messageSource = new BehaviorSubject({});
  currentOrderCount = this.messageSource.asObservable();

  constructor() { }

  addItemToCart(itemid: string, storeid: string)  {
    this.orderObj.itemid = itemid;
    this.orderObj.storeid = storeid;
    this.orders.push(this.orderObj)
    return Promise.resolve().then(() => {
      localStorage.setItem('order', JSON.stringify(this.orders));
    })
    .then(() => {
      const order = JSON.parse(localStorage.getItem('order'));
      console.log('cart order 1 ', order)
      this.messageSource.next(order.length);
    });
  }

  getCartItems() {
    const order = JSON.parse(localStorage.getItem('order'));
    if (order !== null) {
      console.log('cart order 2 ', order)
      return this.messageSource.next(order.length);
    }
    else return this.messageSource.next(this.orders.length);
  }
}
