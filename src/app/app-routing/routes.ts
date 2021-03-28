import { Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';
import { SignupGuardService as SignUpGuard } from '../services/signup-guard.service';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { CreateshopComponent } from '../createshop/createshop.component';
import { HomeComponent } from '../home/home.component';
import { SignupComponent } from '../signup/signup.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProfileComponent } from '../profile/profile.component';

export const routes: Routes = [
  { path: 'sidenav', component: SidenavComponent},
  { path: 'home',  component: HomeComponent },
  { path: 'createshop',  component: CreateshopComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'signup', component: SignupComponent, canActivate: [SignUpGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];