import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { selectSearchCollection } from '../state/search.selectors';
import { searchParts } from 'app/state/search.action';
import { SearchState } from 'app/state/search.state';

import { SearchForm } from 'app/shared/searchform';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent implements OnInit {
  
  searchForm: FormGroup;
  results: Array<string | number>;
  searchErrMess: string;
  showForm = true;
  cartItems: any = [];
  subscription: Subscription;
  add = true;
  remove = false;
  isShown: boolean = false;

  search = {
    city: '',
    state: ''
  }

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
      }
    })
  }

  showResult() {
    this.store.select(selectSearchCollection).subscribe((res) => {
      //console.log('result ',res);
      let result = [];
      if (res.result.length > 0) {
        // The search result returns a matched store object with all store items in the items array.
        // The for loop takes each mapped store and loops through its items array to find the searched item.
        // Isn't the most ideal, would have liked to perform that task server side, but that implementation 
        // would not lend itself.
        res.result.map((item) => {
          for (let i = 0; i < item.items.length; i++) {
            const element = item.items[i];
            if(Object.is(element.vehicletype.toLowerCase(), res.searchkeys.vehicletype.toLowerCase()) 
             && Object.is(element.model.toLowerCase(), res.searchkeys.model.toLowerCase())
              && Object.is(element.year.toLowerCase(), res.searchkeys.year.toLowerCase()) 
                && Object.is(element.part.toLowerCase(), res.searchkeys.part.toLowerCase())) {
                
              let newElement = {
                ...element,
                shopname : item.shopname,
                address : item.address,
                city : item.lga,
                state : item.state,
                telnum : item.telnum,
                storeid : item._id
              } 
              this.search.city = res.searchkeys.city;
              this.search.state = res.searchkeys.state;

              result.push(newElement);
              this.results = result;
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
    this.cartservice.addItemToCart(item)
    .subscribe(res => {
      this.cartItems.push(res);
    })
  }

  removeFromCart(itemid: string) {
    this.cartservice.removeItem(itemid)
    .subscribe(res => {
      if (res == 'done') {
        const cart = this.cartItems;
        cart.splice(cart.findIndex(e => e === itemid), 1);
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

    this.store.dispatch(searchParts({search}));
  }
}


