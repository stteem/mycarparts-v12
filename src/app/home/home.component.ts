import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  search = {
    vehicletype: '', 
    year: '', 
    part: '',
    state: '',
    city:''
  };


  constructor() { 
  }

  ngOnInit() {
  }

  

  onSubmit() {
    console.log('User: ', this.search);
    this.search = {
      vehicletype: '', 
      year: '', 
      part: '',
      state: '',
      city:''
    };
    
  }
}


