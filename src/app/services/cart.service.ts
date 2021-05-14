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

  constructor() { }

  addItemToCart(item: Order): Observable<OrderId>  {
    const order = [];
    console.log('add item ',order)
    
    let storedOrder = JSON.parse(localStorage.getItem('order')); 
    if (storedOrder == null) {
      order.push(item);
      localStorage.setItem('order', JSON.stringify(order));
      const getOrder = JSON.parse(localStorage.getItem('order'));
      const filtered = getOrder.filter(storeditem => storeditem._id == item._id );

      return of(filtered[0]._id);
    }
    storedOrder.push(item);
    localStorage.setItem('order', JSON.stringify(storedOrder));
    const getOrder = JSON.parse(localStorage.getItem('order'));
    const filtered = getOrder.filter(storeditem => storeditem._id == item._id );
    return of(filtered[0]._id);
  }


  removeItem(itemid: string): Observable<string> {
    
    let storedOrder = JSON.parse(localStorage.getItem('order'));
    //console.log('stored items ', storedOrder)
    
    if(storedOrder.length > 1) {
      let filterOrder = storedOrder.filter(item => item._id === itemid);
      filterOrder.forEach(element => {
        storedOrder.splice(storedOrder.findIndex(index => index._id === element._id), 1)
      });
      console.log('storedOrder ',storedOrder);
      localStorage.setItem('order', JSON.stringify(storedOrder));  
      return of('done');
      /*for (let i = 0; i < storedOrder.length; i++) {
        const element = storedOrder[i];
        if (element._id == itemid) {
  
          let newOrder = JSON.parse(localStorage.getItem('order'));
          newOrder.splice(element, 1);
          console.log('updated order ', newOrder)
          
          localStorage.setItem('order', JSON.stringify(newOrder));  
          return of('done');
        }
      }*/
    } 
    else {
      localStorage.removeItem('order');
      return of('done');
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
