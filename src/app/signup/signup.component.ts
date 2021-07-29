import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Signup } from '../shared/signup';
import { SignupService } from '../services/signup.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';

//import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angular-6-social-login';
import { LoginService } from '../services/login.service';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  signup: Signup;
  signupErrMess: string;
  spin: boolean;
  hide = true;
  showForm = true;
  response = null;

  socialuser = {name: '', email: '', image: '', token: ''};



  @ViewChild('signupform') signupFormDirective;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'email': '',
    'telnum': '',
    'password': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
    'telnum': {
      'required':      'Phone number is required.',
      'pattern':       'Phone number must contain only numbers.'
    },
    'password': {
      'required':      'Password is required.',
      'minlength':     'Password must be at least 8 characters.',
      'maxlength':     'Password cannot be more than 64 characters long.'
    }
  };

   

  constructor(private fb: FormBuilder,
    private signupservice: SignupService,
    private loginservice: LoginService,
    //private socialAuthService: AuthService,
    public dialog: MatDialog) { 
    this.createForm();
  }

  

  createForm(): void {
    this.signupForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      email: ['', [Validators.required, Validators.email] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]]
    });

    this.signupForm.valueChanges
    	.subscribe(data => this.onValueChanged(data));

	  this.onValueChanged(); //reset form validation messages
  }

  onValueChanged(data?: any) {
  	if(!this.signupForm) { return; }
  	const form = this.signupForm;
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

  ngOnInit() {
  }

  onSubmit() {
    this.signup = this.signupForm.value;
    console.log(this.signup);
    this.showForm = false;
    this.signupservice.submitSignup(this.signup)
    .subscribe(res => {
      this.response = res;
      console.log('res ',this.response);
      this.signup = null;
      setTimeout(() => {
        this.response = null;
        this.showForm = true;
        this.dialog.open(LoginComponent, {width: '400px', height: '600px'});
      }, 5000);
    },
    signupErrMess => {
      this.signup = null; 
        this.signupErrMess = <any>signupErrMess;
        setTimeout(() => {
          this.signupErrMess = null;
          this.showForm = true;
        }, 3000);
    });

    this.signupForm.reset({
    	firstname: '',
  		lastname: '',
  		email: '',
      telnum: '',
  		password: ''
    });
    this.signupFormDirective.resetForm();
  }

}
