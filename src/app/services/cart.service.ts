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
    
    // Add a new order if there isn't any already in local storage.
    let storedOrder = JSON.parse(localStorage.getItem('order')); 
    if (storedOrder == null) {
      item.qty = 1;
      item.total = item.price;
      order.push(item);
      localStorage.setItem('order', JSON.stringify(order));
      const getOrder = JSON.parse(localStorage.getItem('order'));
      const filtered = getOrder.filter(storeditem => storeditem._id == item._id );

      return of(filtered[0]._id);
    }
    // Push item to an existing order in local storage.
    item.qty = 1;
    item.total = item.price;
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
      
    } 
    else {
      localStorage.removeItem('order');
      return of('done');
    }
  }

  // Oninit home page calls to check if there are items in the cart
  // so the checkout button can be displayed. Also, when a search includes
  // items already in the cart, "Remove from cart" button is displayed instead
  // of "Add to cart". This method services the home component.
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

  // Get cart items for the cart component
  getCart(): Observable<any> {
    const getOrders = JSON.parse(localStorage.getItem('order'));
    if(getOrders !== null) {
      return of(getOrders);
    }
    const emptyArr = [];
    return of(emptyArr);
  }

  addQty(qty, _id): Observable<any> {

    const getOrders = JSON.parse(localStorage.getItem('order'));
    const index = getOrders.findIndex(index => index._id === _id);
    getOrders[index].qty = qty;
    getOrders[index].total = getOrders[index].price * qty;
    localStorage.setItem('order', JSON.stringify(getOrders));
    const getUpdatedOrders = JSON.parse(localStorage.getItem('order'));
    const newQty = getUpdatedOrders[index].qty;
    const newtotal = getUpdatedOrders[index].total;
    return of({
      qty: newQty, 
      total: newtotal,
      index: index
    });
  }

  subtractQty(qty, _id): Observable<any> {
    const getOrders = JSON.parse(localStorage.getItem('order'));
    const index = getOrders.findIndex(index => index._id === _id);
    getOrders[index].qty = qty;
    getOrders[index].total = getOrders[index].price * qty;
    localStorage.setItem('order', JSON.stringify(getOrders));
    const getUpdatedOrders = JSON.parse(localStorage.getItem('order'));
    const newQty = getUpdatedOrders[index].qty;
    const newtotal = getUpdatedOrders[index].total;
    return of({
      qty: newQty, 
      total: newtotal,
      index: index
    });
  }

}
