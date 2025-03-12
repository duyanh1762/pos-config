import { Component, OnInit } from '@angular/core';
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
  type: string; // import || export || delete
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
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  exportBills: Array<IeBillInfor> = [];
  importBills: Array<IeBillInfor> = [];
  startDate: any;
  endDate: any;
  goodsDetail: Array<GoodsDetail> = [];

  staff: Array<Staff> = [];
  shop: Array<Shop> = [];
  goods: Array<Goods> = [];
  supplier:Array<Supplier> = [];

  constructor(public api: ApiService) {}

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
    await this.api
      .staff(request)
      .toPromise()
      .then((res: any) => {
        this.staff = res;
      });
    await this.api
      .shop(request)
      .toPromise()
      .then((res: any) => {
        this.shop = res;
      });
    await this.api
      .goods(request)
      .toPromise()
      .then((res: any) => {
        this.goods = res;
        res.forEach((g:Goods)=>{
          this.goodsDetail.push({...g,import:0,export:0});
        });
      });
      await this.api
      .supplier(request)
      .toPromise()
      .then((res: any) => {
        this.supplier = res;
      });
  }
  sortBills(data: any) {}
  sortGoods(data: any) {}
  showDetail(id: number) {}
  async confirmDate() {
    this.importBills = [];
    this.exportBills = [];
    this.goodsDetail.forEach((gd:GoodsDetail)=>{
      gd.import = 0;
      gd.export = 0;
    });
    if (this.endDate === undefined || this.startDate === undefined) {
      alert('Thời gian không phù hợp, hãy thử lại !');
    } else {
      let start: string = this.api.dateTransform(this.startDate);
      let end: string = this.api.dateTransform(this.endDate);
      let request: DataRequest = {
        mode: 'get-by-range',
        data: `${start},${end}`,
      };
      await this.api
        .ieBill(request)
        .toPromise()
        .then(async(res: any) => {
          let ie:IeBill;
          for(ie of res){
            if (ie.type === 'export') {
              let a:string = '';
              let s:string = '';
              let t:number = 0;
              this.shop.forEach((s:Shop)=>{
                if(ie.shopID === s.id){
                  a = s.address;
                }
              });
              this.staff.forEach((st:Staff)=>{
                if(ie.staffID === st.id){
                  s = st.name
                }
              });
              await this.api.ieDetail({mode:"get",data:Number(ie.id)}).toPromise().then((res:any)=>{
                res.forEach((ied:IeDetail)=>{
                  this.goods.forEach((g:Goods)=>{
                    if(g.id === ied.itemID){
                      t = t + g.price * ied.num;
                      this.goodsDetail.forEach((gd:GoodsDetail)=>{
                        if(ied.itemID === gd.id){
                          gd.export = gd.export + ied.num
                        }
                      });
                    }
                  });
                });
              });
              let ieBI:IeBillInfor = {
                ...ie,
                address:a,
                staff:s,
                total:t,
              }
              this.exportBills.push(ieBI);
            } else if (ie.type === 'import') {
              let a:string = '';
              let s:string = '';
              let t:number = 0;
              s = "Kho"
              this.supplier.forEach((s:Supplier)=>{
                if(ie.shopID === s.id){
                  a = s.name;
                }
              });
              await this.api.ieDetail({mode:"get",data:Number(ie.id)}).toPromise().then((res:any)=>{
                res.forEach((ied:IeDetail)=>{
                  this.goods.forEach((g:Goods)=>{
                    if(g.id === ied.itemID){
                      t = t + g.price * ied.num;
                      this.goodsDetail.forEach((gd:GoodsDetail)=>{
                        if(ied.itemID === gd.id){
                          gd.export = gd.import + ied.num
                        }
                      });
                    }
                  });
                });
              });
              let ieBI:IeBillInfor = {
                ...ie,
                address:a,
                staff:s,
                total:t,
              }
              this.importBills.push(ieBI);
            }
          }
        });
    }
  }
}
