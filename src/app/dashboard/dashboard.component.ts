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

  goToCreateStore() {
    this.router.navigateByUrl('/createshop');
  }

  enterStore(storeId: string) {
    console.log('dash ', storeId)
    this.dashboardService.sendStoreId(storeId);
    this.router.navigateByUrl('/store');
  }

}
