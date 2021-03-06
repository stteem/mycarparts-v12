import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
//import { selectSearchResultState, selectSearchKeysState } from '../state/search.selectors';
import { retrieveSearch } from 'app/state/search.action';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent implements OnInit {
  
  searchForm: FormGroup;
  results: any;
  searchErrMess: string;
  showForm = true;
  cartItems: any = [];
  subscription: Subscription;
  add = true;
  remove = false;
  isShown: boolean = false;

  //searchResult$ = this.store.pipe(select(selectSearchResultState));


  search = {
    vehicletype: '', 
    model: '',
    year: '', 
    part: '',
    state: '',
    city:''
  };


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
    private store: Store) { 
      this.createForm();
  }

  ngOnInit() {
    //console.log('store result ', this.searchResult$)
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
    this.search = this.searchForm.value;
    //this.store.dispatch(searchParts(this.search));
    this.searchservice.searchStores(this.search)
    .subscribe({
      next: (res) => {

      // Search result initialized to empty array in case it's already populated
      this.results = [];

      console.log('search result ',res);
      // The search result returns a matched store object with all store items in the items array.
      // The for loop takes each mapped store and loops through its items array to find the searched item.
      // Isn't the most ideal, would have liked to perform that task server side, but that implementation 
      // would not lend itself.
      res.map((item) => {
        //console.log('item ', item)
        for (let i = 0; i < item.items.length; i++) {
          const element = item.items[i];
          if(Object.is(element.vehicletype.toLowerCase(), this.search.vehicletype.toLowerCase())  && Object.is(element.model.toLowerCase(), this.search.model.toLowerCase())
            && Object.is(element.year.toLowerCase(), this.search.year.toLowerCase()) && Object.is(element.part.toLowerCase(), this.search.part.toLowerCase())) {
              element.shopname = item.shopname;
              element.address = item.address;
              element.city = item.lga;
              element.state = item.state;
              element.telnum = item.telnum;
              element.storeid = item._id;
              /*element.price = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(element.price.toFixed(2));*/
              console.log('pushed ',element.price);
              this.results.push(element);
          }
          
        }
        
      })
      console.log('filtered results', this.results)
      //this.searchFormDirective.resetForm();

    },
    error: (error) => {
      this.showForm = true;
      this.searchErrMess = <any>error;
    },
    complete: () => {
      // Dispatch result to store for memoization, simply known as caching
      //this.store.dispatch(retrieveSearch(this.results));
      console.log('complete')
    }
    });
  }
}


