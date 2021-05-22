import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from 'events';
import { CartService } from '../services/cart.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any;
  cartErrMess: string;
  totalQty: number;
  totalSum: number;

  //@Input() total: any;

  constructor(private cartservice: CartService) { }

  ngOnInit() {
    this.cartservice.getCart()
    .subscribe(res => {
      this.cartItems = res;
      this.calculateTotalQty();
      this.sumTotal();
    })
  }

  calculateTotalQty() {
    const total = []
    Promise.resolve()
      .then(() => {
        this.cartItems.forEach(element => {
          total.push(element.qty)
          console.log('total ',total)
        });
      })
      .then(() => {
        if(total.length !== 0){
          const qtyTotal = total.reduce((a, b) => a + b)
          console.log('reduced qty',qtyTotal)
          return this.totalQty = qtyTotal;
        }
        return this.totalQty = 0;
      })
  }

  sumTotal() {
    const total = []
    this.cartItems.forEach(element => {
      total.push(element.total)
    });
    if(total.length !== 0){
      const sum = total.reduce((a, b) => a + b)
      console.log('reduced sum',sum)
      return this.totalSum = sum;
    }
    return this.totalSum = null;
  }

  removeFromCart(itemid) {
    this.cartservice.removeItem(itemid)
    .subscribe(res => {
      if (res == 'done') {
        const cart = this.cartItems;
        cart.splice(cart.findIndex(e => e._id === itemid), 1);
        console.log('cart ', cart)
        this.calculateTotalQty();
        this.sumTotal();
      }
    })
  }

  addToQty(qty, _id){
    this.cartservice.addQty(qty += 1, _id)
    .subscribe(res => {
      console.log('res add ', res)
      
      this.cartItems[res.index].qty = res.qty;
      this.cartItems[res.index].total = res.total;
      this.calculateTotalQty();
      this.sumTotal()
      console.log('add qty ', this.cartItems)
    })
  }

  subtractFromQty(_id, qty) {
    this.cartservice.subtractQty(qty -= 1, _id)
    .subscribe(res => {
      console.log('res sub ', res)
      
      this.cartItems[res.index].qty = res.qty;
      this.cartItems[res.index].total = res.total;
      this.calculateTotalQty();
      this.sumTotal();
      console.log('sub cart qty ', this.cartItems)
    })
  }

}
