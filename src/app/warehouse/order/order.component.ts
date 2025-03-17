import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DataRequest } from 'src/app/Interface/data_request';
import { Goods } from 'src/app/Models/goods';
import { IeBill } from 'src/app/Models/ie_bill';
import { IeDetail } from 'src/app/Models/ie_detail';
import { Shop } from 'src/app/Models/shop';
import { Staff } from 'src/app/Models/staff';
import { Supplier } from 'src/app/Models/supplier';
import { ApiService } from 'src/app/service/api.service';

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
  export:number;
}
interface DetailInfor{
  id: number
  itemID: number;
  num: number;
  ieID:number;
  note:string;
  name:string;
  unit:string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  shops:Array<Shop> = [];
  staffs:Array<Staff> = [];
  goods:Array<Goods> = [];
  suppliers:Array<Supplier> = [];

  exportBills:Array<IeBillInfor> = [];
  GoodsInfor:Array<GoodsDetail> = [];
  exportDetail:Array<DetailInfor> = [];

  totalBill:number = 0;
  address:string = ""
  user:string = "";

  constructor(public api:ApiService,private bsMS:BsModalService) { }

  ngOnInit(): void {
    this.load();
  }

  async load(){
    let goodsFilter:Array<GoodsDetail> = [];
    let request:DataRequest = {
      mode:"get",
      data:""
    };
    await this.api.shop(request).toPromise().then((res:any)=>{
      this.shops = res;
    });
    await this.api.staff(request).toPromise().then((res:any)=>{
      this.staffs = res;
    });
    await this.api.goods(request).toPromise().then((res:any)=>{
      this.goods = res;
    });
    this.goods.forEach((g:Goods)=>{
      goodsFilter.push({...g,export:0});
    });
    await this.api.supplier(request).toPromise().then((res:any)=>{
      this.suppliers = res;
    });
    await this.api.ieBill(request).toPromise().then(async (res:any)=>{
      let ie:IeBill;
      for(ie of res){
        if(ie.status === "not_confirm" && ie.type === "export"){
          let a:string = "";
          let s:string = "";
          let t:number = 0;
          this.shops.forEach((s:Shop)=>{
            if(s.id === ie.shopID){
              a = s.address;
            }
          });
          this.staffs.forEach((st:Staff)=>{
            if(st.id === ie.staffID){
              s = st.name;
            }
          });
          await this.api.ieDetail({mode:"get",data:Number(ie.id)}).toPromise().then((res:any)=>{
            res.forEach((ied:IeDetail)=>{
              goodsFilter.forEach((g:GoodsDetail)=>{
                if(g.id === ied.itemID){
                  g.export = g.export + ied.num;
                }
              });
            });
          });
          this.exportBills.push({...ie,address:a,staff:s,total:t});
        }
      };
    });
    this.GoodsInfor = goodsFilter.filter((g:GoodsDetail)=>{
      return g.export > 0;
    });
  }
 async getExportInfor(exBill:IeBillInfor){
    this.exportDetail = [];
    this.totalBill = 0;
    this.address = exBill.address;
    this.user = exBill.staff;
    await this.api.ieDetail({mode:"get",data:Number(exBill.id)}).toPromise().then((res:any)=>{
      res.forEach((ied:IeDetail)=>{
        let n:string = "";
        let u:string = "";
        this.goods.forEach((g:Goods)=>{
          if(g.id === ied.itemID){
            n = g.name;
            u = g.unit;
            this.totalBill = this.totalBill + ied.num * g.price;
          }
        });
        this.exportDetail.push({...ied,name:n,unit:u});
      });
    });
  }
}
