import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { CartService } from '../services/cart.service';
import { Subscription, Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { selectSearchCollection, selectSearchKeysState } from '../state/search.selectors';
import { searchParts, retrieveSearch } from 'app/state/search.action';
import { SearchState } from 'app/state/search.state';

import { SearchForm } from 'app/shared/searchform';
import { Result, Items } from 'app/state/search.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent implements OnInit {
  
  searchForm: FormGroup;
  results;
  searchErrMess: string;
  showForm = true;
  cartItems: any = [];
  subscription: Subscription;
  add = true;
  remove = false;
  isShown: boolean = false;



  @ViewChild('searchform') searchFormDirective;
  formErrors = {
    'vehicletype': '',
    'model': '',
    'year': '',
    'part': '',
    'state': '',
    'city': ''
  };

  validationMessages = {
    'vehicletype': {
      'required':      'Vehicle type is required.',
      'minlength':     'Vehicle type must be at least 2 characters long.',
      'maxlength':     'Vehicle type cannot be more than 25 characters long.'
    },
    'model': {
      'required':      'Model is required.'
    },
    'year': {
      'required':      'Year is required.',
      'pattern':       'Year must contain only numbers.'
    },
    'part': {
      'required':      'Part is required.',
      'minlength':     'Part must be at least 2 characters long.',
      'maxlength':     'Part cannot be more than 55 characters long.'
    },
    'state': {
      'required':      'State is required.',
    },
    'city': {
      'required':      'City is required.',
    },
  };


  constructor(private fb: FormBuilder,
    private searchservice: SearchService,
    private cartservice: CartService,
    private store: Store<SearchState>) { 
      this.createForm();
  }


  ngOnInit() {
    this.showResult();
    
    // If a search is done, show items already in the cart
    this.cartservice.getCartItems().subscribe(res => {
      if ( res != null) {
        res.forEach((element: string) => {
          this.cartItems.push(element);
        });
        console.log('cart items 2 ',this.cartItems);
      }
    })
  }

  showResult() {
    this.store.select(selectSearchCollection).subscribe((res) => {
      //console.log('result ',res);
      let result = [];
      if (res.result.length > 0) {
        res.result.map((item) => {
          console.log('item ', item)
          for (let i = 0; i < item.items.length; i++) {
            const element = item.items[i];
            if(Object.is(element.vehicletype.toLowerCase(), res.searchkeys.vehicletype.toLowerCase())  && Object.is(element.model.toLowerCase(), res.searchkeys.model.toLowerCase())
              && Object.is(element.year.toLowerCase(), res.searchkeys.year.toLowerCase()) && Object.is(element.part.toLowerCase(), res.searchkeys.part.toLowerCase())) {
                
              let newElement = {
                ...element,
                shopname : item.shopname,
                address : item.address,
                city : item.lga,
                state : item.state,
                telnum : item.telnum,
                storeid : item._id
              } 
                /*element.price = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(element.price.toFixed(2));*/
                //console.log('newElement ',newElement);
                
                result.push(newElement);
                this.results = result;
                console.log('this results ', this.results)
            }
          }
          
        })
      }
    })
  }


  createForm(): void {
    this.searchForm = this.fb.group({
      vehicletype: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      model: ['', Validators.required ],
      year: ['', [Validators.required, Validators.pattern] ],
      part: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(55)] ],
      state: ['', Validators.required ],
      city: ['', Validators.required ]
    });
    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));
	  this.onValueChanged(); //reset form validation messages
  }
  

  onValueChanged(data?: any) {
  	if(!this.searchForm) { return; }
  	const form = this.searchForm;
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


  addToCart(item) {
    console.log('home item ',item)
    this.cartservice.addItemToCart(item)
    .subscribe(res => {
      this.cartItems.push(res);
      console.log('cart items 1 ',this.cartItems);
    })
  }

  removeFromCart(itemid: string) {
    this.cartservice.removeItem(itemid)
    .subscribe(res => {
      if (res == 'done') {
        const cart = this.cartItems;
        cart.splice(cart.findIndex(e => e === itemid), 1);
        console.log('updated cart items ', this.cartItems)
      }
    })
  }


  onSubmit() {

    // Error message initialized to null if already populated
    this.searchErrMess = null;

    this.showForm = false;
    const search: SearchForm = {
      vehicletype: this.searchForm.value.vehicletype, 
      model: this.searchForm.value.model,
      year: this.searchForm.value.year, 
      part: this.searchForm.value.part,
      state: this.searchForm.value.state,
      city: this.searchForm.value.city
    };
    console.log('search ',search)
    //this.search = this.searchForm.value;
    this.store.dispatch(searchParts({search}));

    setTimeout(() => {
      this.store.select(selectSearchKeysState).subscribe((keys) => {
        console.log('keys ',keys);
      })
    }, 2000);
    
  }
}


