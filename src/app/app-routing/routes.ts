import { Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';
import { SignupGuardService as SignUpGuard } from '../services/signup-guard.service';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { CreateshopComponent } from '../createshop/createshop.component';
import { HomeComponent } from '../home/home.component';
import { SignupComponent } from '../signup/signup.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProfileComponent } from '../profile/profile.component';
import { StoreitemComponent } from '../storeitem/storeitem.component';
import { StoreComponent } from '../store/store.component';
import { CartComponent } from '../cart/cart.component';

export const routes: Routes = [
  { path: 'sidenav', component: SidenavComponent},
  { path: 'home',  component: HomeComponent },
  { path: 'createshop',  component: CreateshopComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'store/:id', component: StoreComponent, canActivate: [AuthGuard]},
  { path: 'storeitem', component: StoreitemComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'signup', component: SignupComponent, canActivate: [SignUpGuard] },
  { path: 'cart', component: CartComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];