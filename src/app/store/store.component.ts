import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StoreitemComponent } from '../storeitem/storeitem.component';
import { DashboardService } from '../services/dashboard.service';
import { StoreitemsService } from '../services/storeitems.service';
import { ActivatedRoute } from '@angular/router';


import { Subscription } from 'rxjs';


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  store_id: any;
  items: any = [];
  storeErrMess: String;
  dialogValue: any;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private storeitemsService: StoreitemsService,
    @Inject('baseURL') private baseURL) { 
      //this.storeitemsService.submitItem.subscribe(res => this.items = res);
    }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.store_id = params.get("id");
      this.storeitemsService.getItems(params.get("id"))
      .subscribe(items => {
        this.items = items;
        console.log('items ', this.items)
      },
      error => this.storeErrMess = <any>error);
    });

    //this.storeitemsService.getCurrentItem().subscribe(res => this.items.unshift(res));

    //this.storeitemsService.submitItem.subscribe(res => this.items = res);
    console.log('store id', this.store_id)
  }


  openStoreForm(): void {
  	const dialogRef = this.dialog.open(StoreitemComponent, 
      {
        width: '500px', 
        height: '800px',
        disableClose: true,
        data: { storeId: this.store_id }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if (result != undefined) {
          return this.items.unshift(result.data); 
        }
        else {
          return null;
        }
      });
  }
  

  ngOnDestroy() {
  }
}