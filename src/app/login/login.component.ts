import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from '@angular/material';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angular-6-social-login';
import { DataService } from '../services/data.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {email: '', password: '', remember: false};
  socialuser = {name: '', email: '', image: ''};



  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private dataservice: DataService,
    private socialAuthService: AuthService
    ) { }

    public socialSignIn(socialPlatform : string) {
      let socialPlatformProvider;
      if(socialPlatform == "facebook"){
        socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
      }else if(socialPlatform == "google"){
        socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
      }
      
      this.socialAuthService.signIn(socialPlatformProvider).then(
        (userData) => {
          console.log(socialPlatform +" sign in data : " , userData);
          // Now sign-in with userData
          this.socialuser.name = userData.name;
          this.socialuser.email = userData.email;
          this.socialuser.image = userData.image;
          console.log('social user sign in data : ' , this.socialuser); 
          this.dataservice.changeMessage(this.socialuser);
        }
      );
    }

  ngOnInit() {
    
  }

  onSubmit() {
    console.log('User: ', this.user);
    this.dialogRef.close();
  }


}
