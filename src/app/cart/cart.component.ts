import { Component, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../services/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/auth.service';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  deliveryForm: FormGroup;
  cartItems: any;
  cartErrMess: string;
  totalQty: number;
  totalSum: number;  
  check_radio: boolean = false;

  delivery: boolean = false;
  shipping: any;

  loggedIn: boolean = false;


  @ViewChild('dform') deliveryFormDirective;
  formErrors = {
    'address': '',
    'lga': '',
    'state': '',
  };

  validationMessages = {
    'address': {
      'required':      'Address is required.',
      'minlength':     'Address must be at least 2 characters long.',
      'maxlength':     'Address cannot be more than 25 characters long.'
    },
    'lga': {
      'required':      'L.G.A is required.',
    },
    'state': {
      'required':      'State is required.',
    },
  };

  constructor(
    private cartservice: CartService,
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private dialog: MatDialog ) { 
      this.createForm();
      this.checkLogin();
    }

    
    checkLogin() {
      console.log('check login')
      if (this.auth.isLoggedIn()) {
        return this.loggedIn = true;
      }
    }

    login() {
      this.dialog.open(LoginComponent, {width: '400px', height: '600px'});
    }


    createForm(): void {
      this.deliveryForm = this.fb.group({
        address: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        lga: ['', Validators.required ],
        state: ['', Validators.required ],
        save: [''],
      });
      this.deliveryForm.valueChanges.subscribe(data => this.onValueChanged(data));
      this.onValueChanged(); //reset form validation messages
    }

    onValueChanged(data?: any) {
      if(!this.deliveryForm) { return; }
      const form = this.deliveryForm;
      for (const field in this.formErrors) {
        if(this.formErrors.hasOwnProperty(field)) {
          //clear previous error messages if any
          this.formErrors[field] = '';
          const control = form.get(field);
          if(control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }

    onSubmit(){

    }

  ngOnInit() {
    this.cartservice.getCart()
    .subscribe(res => {
      console.log('get cart ', res)
      this.cartItems = res;
      this.calculateTotalQty();
      this.sumTotal();
      this.checkDeliveryMethod();
      this.getShipping();
    })
    this.auth.loggedIn()
    .subscribe(res => {
      console.log('logged in res ', res)
      res == true ? this.loggedIn = true : this.loggedIn = false;
    })
  }

  calculateTotalQty() {
    const total = []
    Promise.resolve()
      .then(() => {
        this.cartItems.forEach(element => {
          total.push(element.qty)
        });
      })
      .then(() => {
        if(total.length !== 0){
          const qtyTotal = total.reduce((a, b) => a + b)
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
      //console.log('reduced sum',sum)
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
        //console.log('cart ', cart)
        this.calculateTotalQty();
        this.sumTotal();
      }
    })
  }

  addToQty(qty, _id){
    this.cartservice.addQty(qty += 1, _id)
    .subscribe(res => {      
      this.cartItems[res.index].qty = res.qty;
      this.cartItems[res.index].total = res.total;
      this.calculateTotalQty();
      this.sumTotal()
    })
  }

  subtractFromQty(_id, qty) {
    this.cartservice.subtractQty(qty -= 1, _id)
    .subscribe(res => {      
      this.cartItems[res.index].qty = res.qty;
      this.cartItems[res.index].total = res.total;
      this.calculateTotalQty();
      this.sumTotal();
    })
  }

  getRadioValue(event, _id) {
    this.cartservice.updateDeliveryStatus(event.value, _id)
    .subscribe(res => {
      console.log('event res ',res)
      if (res.delivery == "true") {
        this.cartItems[res.index].delivery = res.delivery;
        this.shipping = res.shipping;
        this.checkDeliveryMethod();
      }
      else{
        this.cartItems[res.index].delivery = res.delivery;
        this.checkDeliveryMethod();
      }
    })
  }

  checkDeliveryMethod() {
    const getItem = this.cartItems.filter(e => e.delivery === 'true');
    if (getItem.length > 0) {
      return this.delivery = true;
    }
    return this.delivery = false;
  }

  getShipping() {
    this.cartservice.getShippingAddress()
    .subscribe(res => {
      return this.shipping = res;
    })
  }

  postShipping() {

  }

}
