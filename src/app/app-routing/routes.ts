import { Routes } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { CreateshopComponent } from '../createshop/createshop.component';
import { HomeComponent } from '../home/home.component';

export const routes: Routes = [
  { path: 'sidenav', component: SidenavComponent},
  { path: 'home',  component: HomeComponent },
  { path: 'createshop',  component: CreateshopComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];