import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/core/service/api.service';
import { DataRequest } from 'src/app/shared/Interface/data_request';
import { Shop } from 'src/app/shared/Models/shop';


@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent implements OnInit {
  @ViewChild("searchInput",{read:ElementRef,static:true}) searchInput:ElementRef;

  shops:Array<Shop> = [];
  shopsLU:Array<Shop> = [];

  constructor(private api:ApiService,private bsModal:BsModalService,private router:Router) { }

  ngOnInit(): void {
    this.load();
  }
  load(){
    let request:DataRequest = {
      mode:"get",
      data:"",
    };
    this.api.shop(request).subscribe((res:any)=>{
      res.forEach((s:Shop)=>{
        this.shops = res;
        this.shopsLU = res;
      });
    });
  }
  search(){
    this.shops = [];
    let value:string  = this.searchInput.nativeElement.value;
    if(value.length <= 0){
      this.shops = this.shopsLU;
    }else{
      this.shopsLU.forEach((s:Shop)=>{
        if(this.api.removeAccents(s.address).toLowerCase().indexOf(this.api.removeAccents(value.toLowerCase())) != -1){
          this.shops.push(s);
        }
      });
    }
  }
  addShop(){
    localStorage.setItem("shop-handle","true");
    localStorage.setItem("shop-type","create");
    localStorage.setItem("shop-infor",JSON.stringify(null));
    this.router.navigate(["/home/shops/details"]);
  }
  showShop(s:Shop){
    localStorage.setItem("shop-handle","true");
    localStorage.setItem("shop-type","edit");
    localStorage.setItem("shop-infor",JSON.stringify(s));
    this.router.navigate(["/home/shops/details"]);
  }
}
