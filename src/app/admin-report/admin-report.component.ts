import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataRequest } from '../Interface/data_request';
import { Staff } from '../Models/staff';
import { Shop } from '../Models/shop';
import { Goods } from '../Models/goods';
import { Supplier } from '../Models/supplier';
import { ApiService } from '../service/api.service';
import { IeBill } from '../Models/ie_bill';
import { IeDetail } from '../Models/ie_detail';
import { Item } from '../Models/item';
import { Bill } from '../Models/bill';
import { BillDetail } from '../Models/bill_detail';
import { Spend } from '../Models/spend';
interface IeBillInfor {
  id: number;
  createAt: string;
  confirmAt: string;
  staffID: number;
  shopID: number;
  status: string;
  type: string; // import || export
  address: string;
  staff: string;
  total: number;
}
interface GoodsDetail{
  id:number;
  name:string
  unit:string;
  groupID:number;
  price:number;
  remaining:number;
  import:number;
  export:number;
}

interface ShopInfor{
  id: number;
  name: string;
  password: string;
  address: string;
  policyID:number;
  number_table:number;
  bankID:string;
  account_no:string;
  salesTotal:number;
  goodsTotal:number;
  spendTotal:number;
}
interface ItemInfor{
  id:number;
  policyID:number[];
  name:string
  price:number;
  groupID:number;
  num:number;
}
@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.css']
})
export class AdminReportComponent implements OnInit {
    @ViewChild("shopInput",{read:ElementRef,static:true}) shopInput:ElementRef;
    @ViewChild("shopSelect",{read:ElementRef,static:true}) shopSelect:ElementRef;

    startDate: any;
    endDate: any;
    goodsDetail: Array<GoodsDetail> = [];

    shops: Array<ShopInfor> = [];
    shopsLU:Array<ShopInfor> = [];
    goods: Array<Goods> = [];
    items:Array<ItemInfor> = [];

    hide:boolean = true;
    sortType:string = "upper";

  constructor(public api:ApiService) { }

  ngOnInit(): void {
    this.load();
  }

    onStartDateChange(event: any): void {
      if (event) {
        this.startDate = new Date(event);
        this.startDate.setHours(0, 0, 0, 0);
      }
    }

    onEndDateChange(event: any): void {
      if (event) {
        this.endDate = new Date(event);
        this.endDate.setHours(23, 59, 59, 999);
      }
    }

    async load() {
      let request: DataRequest = {
        mode: 'get',
        data: '',
      };
      await this.api.shop(request).toPromise().then((res:any)=>{
        res.forEach((s:Shop)=>{
          this.shops.push({...s,salesTotal:0,goodsTotal:0,spendTotal:0});
          this.shopsLU.push({...s,salesTotal:0,goodsTotal:0,spendTotal:0});
        });
      });
      await this.api.item(request).toPromise().then((res:any)=>{
        res.forEach((i:Item)=>{
          this.items.push({...i,num:0});
        });
      });
      await this.api.goods(request).toPromise().then((res:any)=>{
        this.goods = res;
      });
    }

    async confirmDate() {
      this.shops.forEach((s:ShopInfor)=>{
        s.salesTotal = 0;
        s.goodsTotal = 0;
        s.spendTotal = 0;
      });
      this.items.forEach((i:ItemInfor)=>{
        i.num = 0;
      });
      if (this.endDate === undefined || this.startDate === undefined) {
        alert('Thời gian không phù hợp, hãy thử lại !');
      } else {
        this.hide = false;
        let start: string = this.api.dateTransform(this.startDate);
        let end: string = this.api.dateTransform(this.endDate);
        for(let s of this.shopsLU){
          let request:DataRequest = {
            mode:"get-by-range-shop",
            data:`${start},${end},${s.id}`
          };
          await this.api.bill(request).toPromise().then(async (res:any)=>{
            let b:Bill;
            for(b of res){
              if(b.status === "pay"){
                let billTotal:number = 0;
                await this.api.billDetail({mode:"get",data:b.id}).toPromise().then((res2:any)=>{
                  res2.forEach((bd:BillDetail)=>{
                    this.items.forEach((i:ItemInfor)=>{
                      if(i.id === bd.itemID){
                        i.num = i.num + bd.num;
                        billTotal = billTotal + bd.num * i.price;
                      }
                    });
                  });
                });
                s.salesTotal = s.salesTotal + billTotal;
              }
            }
          });
          await this.api.ieBill(request).toPromise().then(async (res:any)=>{
            let ieb:IeBill;
            for(ieb of res){
              if(ieb.type === "export"  && ieb.status === "confirm"){
                let ieTotal:number = 0;
                await this.api.ieDetail({mode:"get",data:ieb.id}).toPromise().then((res2:any)=>{
                  res2.forEach((ied:IeDetail)=>{
                    this.goods.forEach((g:Goods)=>{
                      if(g.id === ied.itemID){
                        ieTotal = ieTotal + g.price * ied.num;
                      }
                    });
                  });
                });
                s.goodsTotal = s.goodsTotal + ieTotal;
              }
            }
          });
          await this.api.spend(request).toPromise().then((res:any)=>{
            res.forEach((spend:Spend)=>{
              if(spend.status === "Active"){
                s.spendTotal = s.spendTotal + spend.total
              }
            });
          });
        }
        this.shops = this.shopsLU;
      }
  }
  filterSelect(){
    this.shops = [];
    let valueSelect:string = this.shopSelect.nativeElement.value;
    if(valueSelect === ""){
      this.shops = this.shopsLU;
    }else{
      this.shops = this.shopsLU.filter((s:ShopInfor)=>{
        return s.address.indexOf(valueSelect) != -1;
      });
    }
  }
  filter(){
    this.shops = [];
    let valueInput:string = this.shopInput.nativeElement.value;
    if(valueInput.length <= 0){
      this.shops = this.shopsLU;
    }else{
      this.shops = this.shopsLU.filter((s:ShopInfor)=>{
        return s.address.indexOf(valueInput) != -1;
      });
    }
  }
  sort(data:string,type:string){
    if(this.sortType === "upper"){
      if(data === "shop"){
        if(type === "sales"){
          for(let i = 0;i<this.shops.length;i++){
            for(let j = i + 1;j<this.shops.length;j++){
              if(this.shops[j].salesTotal < this.shops[i].salesTotal){
                let temp:ShopInfor = this.shops[i];
                this.shops[i] = this.shops[j];
                this.shops[j] = temp;
              }
            }
          }
        }else if(type === "goods"){
          for(let i = 0;i<this.shops.length;i++){
            for(let j = i + 1;j<this.shops.length;j++){
              if(this.shops[j].goodsTotal < this.shops[i].goodsTotal){
                let temp:ShopInfor = this.shops[i];
                this.shops[i] = this.shops[j];
                this.shops[j] = temp;
              }
            }
          }
        }else if(type === "spend"){
          for(let i = 0;i<this.shops.length;i++){
            for(let j = i + 1;j<this.shops.length;j++){
              if(this.shops[j].spendTotal < this.shops[i].spendTotal){
                let temp:ShopInfor = this.shops[i];
                this.shops[i] = this.shops[j];
                this.shops[j] = temp;
              }
            }
          }
        }else if(type === "profit"){
          for(let i = 0;i<this.shops.length;i++){
            let profitI:number  = this.shops[i].salesTotal - this.shops[i].goodsTotal - this.shops[i].spendTotal;
            for(let j = i + 1;j<this.shops.length;j++){
              let profitJ:number  = this.shops[j].salesTotal - this.shops[j].goodsTotal - this.shops[j].spendTotal;
              if(profitJ < profitI){
                let temp:ShopInfor = this.shops[i];
                this.shops[i] = this.shops[j];
                this.shops[j] = temp;
              }
            }
          }
        }
      }else if(data === "item"){
        if(type === "num"){
          for(let i = 0;i<this.items.length;i++){
            for(let j = i + 1;j<this.items.length;j++){
              if(this.items[j].num < this.items[i].num){
                let temp:ItemInfor = this.items[i];
                this.items[i] = this.items[j];
                this.items[j] = temp;
              }
            }
          }
        }else if(type === "total"){
          for(let i = 0;i<this.items.length;i++){
            let totalI:number = this.items[i].num * this.items[i].price;
            for(let j = i + 1;j<this.items.length;j++){
              let totalJ:number = this.items[j].num * this.items[j].price;
              if(totalJ < totalI){
                let temp:ItemInfor = this.items[i];
                this.items[i] = this.items[j];
                this.items[j] = temp;
              }
            }
          }
        }
      }
      this.sortType = "lower";
    }else if( this.sortType === "lower"){
      if(data === "shop"){
        if(type === "sales"){
          for(let i = 0;i<this.shops.length;i++){
            for(let j = i + 1;j<this.shops.length;j++){
              if(this.shops[j].salesTotal > this.shops[i].salesTotal){
                let temp:ShopInfor = this.shops[i];
                this.shops[i] = this.shops[j];
                this.shops[j] = temp;
              }
            }
          }
        }else if(type === "goods"){
          for(let i = 0;i<this.shops.length;i++){
            for(let j = i + 1;j<this.shops.length;j++){
              if(this.shops[j].goodsTotal > this.shops[i].goodsTotal){
                let temp:ShopInfor = this.shops[i];
                this.shops[i] = this.shops[j];
                this.shops[j] = temp;
              }
            }
          }
        }else if(type === "spend"){
          for(let i = 0;i<this.shops.length;i++){
            for(let j = i + 1;j<this.shops.length;j++){
              if(this.shops[j].spendTotal > this.shops[i].spendTotal){
                let temp:ShopInfor = this.shops[i];
                this.shops[i] = this.shops[j];
                this.shops[j] = temp;
              }
            }
          }
        }else if(type === "profit"){
          for(let i = 0;i<this.shops.length;i++){
            let profitI:number  = this.shops[i].salesTotal - this.shops[i].goodsTotal - this.shops[i].spendTotal;
            for(let j = i + 1;j<this.shops.length;j++){
              let profitJ:number  = this.shops[j].salesTotal - this.shops[j].goodsTotal - this.shops[j].spendTotal;
              if(profitJ > profitI){
                let temp:ShopInfor = this.shops[i];
                this.shops[i] = this.shops[j];
                this.shops[j] = temp;
              }
            }
          }
        }
      }else if(data === "item"){
        if(type === "num"){
          for(let i = 0;i<this.items.length;i++){
            for(let j = i + 1;j<this.items.length;j++){
              if(this.items[j].num > this.items[i].num){
                let temp:ItemInfor = this.items[i];
                this.items[i] = this.items[j];
                this.items[j] = temp;
              }
            }
          }
        }else if(type === "total"){
          for(let i = 0;i<this.items.length;i++){
            let totalI:number = this.items[i].num * this.items[i].price;
            for(let j = i + 1;j<this.items.length;j++){
              let totalJ:number = this.items[j].num * this.items[j].price;
              if(totalJ > totalI){
                let temp:ItemInfor = this.items[i];
                this.items[i] = this.items[j];
                this.items[j] = temp;
              }
            }
          }
        }
      }
      this.sortType = "upper";
    }
  }
}
