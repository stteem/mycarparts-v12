import { Component, OnInit, Inject } from '@angular/core';
import { Shop } from '../shared/shop';
import { DashboardService } from '../services/dashboard.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  shops: Shop[];
  errMess: string;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    @Inject('baseURL') private baseURL) { }

  ngOnInit() {
    this.dashboardService.getShops()
      .subscribe(shops => setTimeout(() => {
        this.shops = shops
        console.log('shop', shops)
      }, 1000) ,
        errmess => this.errMess = <any>errmess);
  }

  tryAgain() {
    this.errMess = null;
    this.dashboardService.getShops()
      .subscribe(shops => setTimeout(() => {
        this.shops = shops;
        console.log('try again', shops)
      }, 1000) ,
        errmess => this.errMess = <any>errmess);
  }

}
