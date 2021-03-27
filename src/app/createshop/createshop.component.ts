import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Createshop } from '../shared/createshop';
import { CreateshopService } from '../services/createshop.service';

//import { visibility } from '../animations/app.animation';
//import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-createshop',
  templateUrl: './createshop.component.html',
  styleUrls: ['./createshop.component.scss']
})
export class CreateshopComponent implements OnInit {

  createshopForm: FormGroup;
  createshop: Createshop;
  hideForm: boolean;
  createshopErrMess: string;
  spin: boolean;

  @ViewChild('csform') createshopFormDirective;


  formErrors = {
    'shopname': '',
    'address': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'shopname': {
      'required':      'Shop name is required.',
      'minlength':     'Shop name must be at least 2 characters long.',
      'maxlength':     'Shop name cannot be more than 25 characters long.'
    },
    'address': {
      'required':      'Address is required.',
      'minlength':     'Address must be at least 2 characters long.',
      'maxlength':     'Address cannot be more than 55 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email format not valid.'
    },
  };

  constructor(private fb: FormBuilder,
    private createshopservice: CreateshopService) { 
      this.createForm();
    }

  ngOnInit() {
    this.spin = true;
    this.hideForm = false;
  }

  createForm(): void {
    this.createshopForm = this.fb.group({
      shopname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      address: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(55)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      description: ''
    });

    this.createshopForm.valueChanges
    	.subscribe(data => this.onValueChanged(data));

	this.onValueChanged(); //reset form validation messages
  }

  onValueChanged(data?: any) {
  	if(!this.createshopForm) { return; }
  	const form = this.createshopForm;
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

  onSubmit() {
    this.createshop = this.createshopForm.value;
    console.log(this.createshop);
    this.spin = false;
    this.hideForm = true;
    this.createshopservice.submitShop(this.createshop)
    .subscribe(shop => {
      this.spin = true;
      this.createshop = shop;
      setTimeout(() => {
        this.createshop = null;
        this.hideForm = false;
      }, 5000);
    },
    createshopErrMess => {
      this.createshop = null; 
        //this.createshopCopy = null; 
        this.createshopErrMess = <any>createshopErrMess;
    });

    this.createshopForm.reset({
    	shopname: '',
  		address: '',
  		telnum: '',
  		email: '',
  		description: ''
    });
    this.createshopFormDirective.resetForm();
  }

}
