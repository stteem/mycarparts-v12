import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { Order } from '../shared/order';

interface OrderId {
  _id: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  exists = JSON.parse(localStorage.getItem('order'));
  orders = this.exists == null ? [] : this.exists;

  constructor() { }

  addItemToCart(item: Order): Observable<OrderId>  {
    this.orders.push(item);
    localStorage.setItem('order', JSON.stringify(this.orders)); 
    const storedOrder = JSON.parse(localStorage.getItem('order'));
    const filtered = storedOrder.filter(storeditem => storeditem._id == item._id );

    return of(filtered[0]._id);
  }


  removeItem(itemid) {
    console.log('cart service itemid ', itemid)
    const updatedOrder = [];
    const storedOrder = JSON.parse(localStorage.getItem('order'));
    for (let i = 0; i < storedOrder.length; i++) {
      const element = storedOrder[i];
      if (element._id == itemid) {
        storedOrder.splice(element, 1);
        console.log('updated order ', storedOrder)
        updatedOrder.push(storedOrder);
        Promise.resolve().then(() => {
          localStorage.setItem('order', JSON.stringify(updatedOrder)); 
        })
        .then(() => {
  
        })
      }
    }
    

  }

  getCartItems(): Observable<any> {
    const values = [];
    const storedOrder = JSON.parse(localStorage.getItem('order'));
    if (storedOrder !== null) {
      for (let i = 0; i < storedOrder.length; i++) {
        const element = storedOrder[i];
        values.push(element._id);
      }
      return of(values);
    }
    return of(values);
  }
}
