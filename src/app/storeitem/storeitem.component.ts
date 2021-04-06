import { Component, OnInit, ViewChild, OnDestroy, Optional, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { MatDialogRef} from '@angular/material';
import { StoreitemsService } from '../services/storeitems.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Item } from '../shared/item';

import { DashboardService } from '../services/dashboard.service';


@Component({
  selector: 'app-storeitem',
  templateUrl: './storeitem.component.html',
  styleUrls: ['./storeitem.component.scss']
})
export class StoreitemComponent implements OnInit, OnDestroy {

  storeitemForm: FormGroup;
  storeitem: Item;
  //showForm = true;
  storeitemErrMess: string;
  response = null;
  fileurl: string;
  file: any;
  progress = 0;
  progress_bar: Boolean;

  subscription: Subscription;
  store_id: any;

  @ViewChild('sform') storeitemFormDirective;



  formErrors = {
    'vehicletype': '',
    'model': '',
    'year': '',
    'part': '',
    'price': '',
    'image': ''
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
    'price': {
      'required':      'Price is required.',
      'pattern':       'Price must contain only numbers.'
    },
    'image': {
      'required':      'Image is required.'
    }
  };

  constructor(private fb: FormBuilder,
    private storeitemsservice: StoreitemsService,
    private router: Router,
    public dialogRef: MatDialogRef<StoreitemComponent>,
    private dashboardService: DashboardService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.createForm();
      this.store_id = data.storeId;
    }

  ngOnInit() {
    //this.subscription = this.dashboardService.currentStore.subscribe(id => this.store_id = id);
    console.log('modal store id', this.store_id)
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }

  dialogClose() {
    this.response == null ?
    this.dialogRef.close() :
    this.dialogRef.close({ event: 'close', data: this.response });
  }


  onValueChanged(data?: any) {
  	if(!this.storeitemForm) { return; }
  	const form = this.storeitemForm;
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

  createForm(): void {
    this.storeitemForm = this.fb.group({
      vehicletype: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      model: ['', Validators.required ],
      year: ['', [Validators.required, Validators.pattern] ],
      part: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)] ],
      price: ['', [Validators.required, Validators.pattern] ],
      image: ['', Validators.required ],
    });
    this.storeitemForm.valueChanges.subscribe(data => this.onValueChanged(data));
	  this.onValueChanged(); //reset form validation messages
  }

  onClick() {
    const fileUpload = document.getElementById('image') as HTMLInputElement;
    this.progress_bar = true;
    this.progress = 0;

    fileUpload.onchange = () => {
       this.file = fileUpload.files[0]; 

       // Set fileurl to null for subsequent changes
       this.fileurl = null;

      // If no file, remove progress bar and set progress to 0
       if (!this.file) {
         this.progress = 0;
         this.progress_bar = false;
       }

      //Show image preview
      let reader = new FileReader();
      reader.onload = (event: any) => {
        setTimeout(() => {
          this.fileurl = event.target.result;
        }, 1000);
        console.log('load event ', event)
      }

      //Show image upload progress
      reader.onprogress = (event: any) => {
        console.log('progress event ', event)
        this.progress =  Math.round(event.loaded * 100 / event.total);
      }

      reader.onabort = (event: any) => {
        this.progress_bar = false;
        console.log('abort event ', event)
      }

      if (this.file) {
        reader.readAsDataURL(this.file);
        console.log('file ',this.file)
      }
    };
    fileUpload.click();
  }

  onSubmit() {
    this.storeitem = this.storeitemForm.value;
    console.log('new shop ',this.storeitem);
    //this.showForm = false;
    this.storeitemsservice.submitItem(this.store_id, this.storeitem, this.file)
    .subscribe(res => {
      console.log('created item ',res);
      this.response = res;
      this.storeitem = null;
      this.dialogClose();
    },
    error => {
      this.storeitemErrMess = <any>error;
    });
    //this.storeitemFormDirective.resetForm();
  }
}
