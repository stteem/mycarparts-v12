import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { Order } from '../shared/order';
import { Catchment } from '../shared/catchment';

import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';



interface OrderId {
  _id: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient,
      private processHTTPMsgService: ProcessHttpmsgService) { }

  addItemToCart(item: Order): Observable<OrderId>  {
    const order = [];
    console.log('add item ',order)
    
    // Add a new order if there isn't any already in local storage.
    let storedOrder = JSON.parse(localStorage.getItem('order')); 
    if (storedOrder == null) {
      item.qty = 1;
      item.total = item.price;
      item.delivery = false;
      item.destination = ''
      order.push(item);
      localStorage.setItem('order', JSON.stringify(order));
      const getOrder = JSON.parse(localStorage.getItem('order'));
      const filtered = getOrder.filter(storeditem => storeditem._id == item._id );

      return of(filtered[0]._id);
    }
    // Push item to an existing order in local storage.
    item.qty = 1;
    item.total = item.price;
    item.delivery = false;
    item.destination = '';
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

  updateDeliveryStatus(value: string, _id: string): Observable<any> {

    console.log('value ', value)

    if (value == "true") {

      const get_shipping = JSON.parse(localStorage.getItem('shipping'));
      console.log('get shipping ', get_shipping);

      if (get_shipping == null) {

        // Fetch shipping address if no shipping is set
        return this.http.get(baseURL + 'api/v1/auth/users/shipping_address')

        .pipe( map(res => {

          console.log('pipe res ',res); 
          localStorage.setItem('shipping', JSON.stringify(res[0].shipping_address));
          
          const getOrders = JSON.parse(localStorage.getItem('order'));

          const index = getOrders.findIndex(index => index._id === _id);
          getOrders[index].delivery = value;

          localStorage.setItem('order', JSON.stringify(getOrders));

          const shipping_address = JSON.parse(localStorage.getItem('shipping'));
          console.log('get address ', shipping_address)
          const getUpdatedOrders = JSON.parse(localStorage.getItem('order'));
          const newDelivery = getUpdatedOrders[index].delivery;

          return {
            delivery: newDelivery,
            index: index,
            shipping: shipping_address
          };
        }),
        catchError(error => this.processHTTPMsgService.handleError(error)));
      }
      else{
        const shipping_address = JSON.parse(localStorage.getItem('shipping'));
        const getOrders = JSON.parse(localStorage.getItem('order'));
        const index = getOrders.findIndex(index => index._id === _id);
        getOrders[index].delivery = value;
        localStorage.setItem('order', JSON.stringify(getOrders));
        const getUpdatedOrders = JSON.parse(localStorage.getItem('order'));
        const newDelivery = getUpdatedOrders[index].delivery;
        return of({
          delivery: newDelivery,
          index: index,
          shipping: shipping_address
        });
      }
    }
    
    const getOrders = JSON.parse(localStorage.getItem('order'));
    const index = getOrders.findIndex(index => index._id === _id);
    getOrders[index].delivery = value;
    localStorage.setItem('order', JSON.stringify(getOrders));
    const getUpdatedOrders = JSON.parse(localStorage.getItem('order'));
    const newDelivery = getUpdatedOrders[index].delivery;
    return of({
      delivery: newDelivery,
      index: index
    });
  }

  getShippingAddress(): Observable<any> {
    const shipping_address = JSON.parse(localStorage.getItem('shipping'));
    if (shipping_address == null) {
      return of([]);
    }
    return of(shipping_address);
  }

  postShippingAddress(): Observable<any> {
    return of()
  } 

  calculateDelivery(value, item, weight) {
    var rate: number;
    switch (value == "true" && weight <= 5) {
      case item.state == item.destinationState :
      case item.city == item.destinationCity :
        return rate = 1000;
        
      case item.state == item.destinationState :
      case item.city !== item.destinationCity:
        return rate = 1200;
        
        case item.state == "Lagos" : 
        case item.state !== item.destinationState : 
        case Catchment.lagos.includes(item.destinationState.toLowerCase()):
        return rate = 2000;
        
        case item.state == "Abia" : 
        case item.state !== item.destinationState : 
        case Catchment.abia.includes(item.destinationState.toLowerCase()):
        return rate = 2000;
        
        case item.state == "Anambra" : 
        case item.state !== item.destinationState : 
        case Catchment.anambra.includes(item.destinationState.toLowerCase()):
        return rate = 2000;
        
        case item.state == "Imo" : 
        case item.state !== item.destinationState : 
        case Catchment.imo.includes(item.destinationState.toLowerCase()):
        return rate = 2000;
        
        case item.state == "Akwa Ibom" : 
        case item.state !== item.destinationState : 
        case Catchment['akwa ibom'].includes(item.destinationState.toLowerCase()):
        return rate = 2000;
        
        case item.state == "Cross River" : 
        case item.state !== item.destinationState : 
        case Catchment['cross river'].includes(item.destinationState.toLowerCase()):
        return rate = 2000;
        
        case item.state == "Rivers" : 
        case item.state !== item.destinationState : 
        case Catchment.rivers.includes(item.destinationState.toLowerCase()):
        return rate = 2000;
        
      default:
        return rate = 2500;
        
    }
  }

}
