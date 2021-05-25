import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from '@angular/material';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angular-6-social-login';
import { LoginService } from '../services/login.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';
import { Location } from '@angular/common';






@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {email: '', password: ''};
  socialuser = {name: '', email: '', image: '', token: ''};
  hide = true;
  loginErrMess: string;
  private history: string[] = []

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private loginservice: LoginService,
    private socialAuthService: AuthService,
    private router: Router,
    private authService: AuthenticationService,
    private location: Location
    ) { 
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.history.push(event.urlAfterRedirects)
        }
      });
    }

    public socialSignIn(socialPlatform : string) {
      let socialPlatformProvider;
      /*if(socialPlatform == "facebook"){
        socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
      }else*/ if(socialPlatform == "google"){
        socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
      }
      
      this.socialAuthService.signIn(socialPlatformProvider).then(
        (userData) => {
          //console.log(socialPlatform +" sign in data : " , userData);
          // Now sign-in with userData
          this.socialuser.name = userData.name;
          this.socialuser.email = userData.email;
          this.socialuser.image = userData.image;
          this.socialuser.token = userData.idToken;
          //console.log('social user sign in data : ' , this.socialuser); 
          this.loginservice.loginSocialUser(this.socialuser);
          this.dialogRef.close();
        }
      );
    }


  ngOnInit() {
    //console.log('location ', this.location)
  }

  dialogClose() {
    this.dialogRef.close();
  }

  back(): void {
    this.history.pop()
    if (this.history.length > 0) {
      this.location.back()
    } else {
      this.router.navigateByUrl('/')
    }
  }

  onSubmit() {
    console.log('User: ', this.user);
    this.authService.logIn(this.user)
    .subscribe(res => {
      if (res.success) {
        this.dialogRef.close(res.success);
        this.back();
      } else {
        console.log(res);
        //this.loginErrMess = res.errMsg;
      }
    },
    error => {
      console.log(error);
      this.loginErrMess = error;
    });    
  }


}
