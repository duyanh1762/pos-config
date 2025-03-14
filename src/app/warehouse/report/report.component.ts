import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DataRequest } from 'src/app/Interface/data_request';
import { Goods } from 'src/app/Models/goods';
import { IeBill } from 'src/app/Models/ie_bill';
import { IeDetail } from 'src/app/Models/ie_detail';
import { Shop } from 'src/app/Models/shop';
import { Staff } from 'src/app/Models/staff';
import { Supplier } from 'src/app/Models/supplier';
import { ApiService } from 'src/app/service/api.service';
import { DetailOrderComponent } from './detail-order/detail-order.component';
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
  @ViewChild("shopInput",{read:ElementRef,static:true}) shopInput:ElementRef;
  @ViewChild("supplierInput",{read:ElementRef,static:true}) suppInput:ElementRef;

  exportBills: Array<IeBillInfor> = [];
  importBills: Array<IeBillInfor> = [];
  exportLU:Array<IeBillInfor> = [];
  importLU:Array<IeBillInfor> = [];
  startDate: any;
  endDate: any;
  goodsDetail: Array<GoodsDetail> = [];

  staff: Array<Staff> = [];
  shop: Array<Shop> = [];
  goods: Array<Goods> = [];
  supplier:Array<Supplier> = [];

  hide:boolean = true;
  sortType:string = "upper";

  constructor(public api: ApiService , private bsMS:BsModalService) {}

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

  sort(data:string,type:string){
    if(data === "export"){
      if(type === "confirmAt"){
        for(let i = 0;i<this.exportBills.length;i++){
          for(let j = i + 1;j<this.exportBills.length;j++){
            let dateI = new Date(this.exportBills[i].confirmAt);
            let dateJ = new Date(this.exportBills[j].confirmAt);
            if(this.sortType === "upper"){
              if(dateJ < dateI){
                let temp:IeBillInfor = this.exportBills[i];
                this.exportBills[i] = this.exportBills[j];
                this.exportBills[j] = temp;
              }
            }else{
              if(dateJ > dateI){
                let temp:IeBillInfor = this.exportBills[i];
                this.exportBills[i] = this.exportBills[j];
                this.exportBills[j] = temp;
              }
            }
          }
        }
      }else if(type === "createAt"){
        for(let i = 0;i<this.exportBills.length;i++){
          for(let j = i + 1;j<this.exportBills.length;j++){
            let dateI = new Date(this.exportBills[i].createAt);
            let dateJ = new Date(this.exportBills[j].createAt);
            if(this.sortType === "upper"){
              if(dateJ < dateI){
                let temp:IeBillInfor = this.exportBills[i];
                this.exportBills[i] = this.exportBills[j];
                this.exportBills[j] = temp;
              }
            }else{
              if(dateJ > dateI){
                let temp:IeBillInfor = this.exportBills[i];
                this.exportBills[i] = this.exportBills[j];
                this.exportBills[j] = temp;
              }
            }
          }
        }
      }else{
        for(let i = 0;i<this.exportBills.length;i++){
          for(let j = i + 1;j<this.exportBills.length;j++){
            let totalI = this.exportBills[i].total;
            let totalJ = this.exportBills[j].total;
            if(this.sortType === "upper"){
              if(totalJ < totalI){
                let temp:IeBillInfor = this.exportBills[i];
                this.exportBills[i] = this.exportBills[j];
                this.exportBills[j] = temp;
              }
            }else{
              if(totalJ > totalI){
                let temp:IeBillInfor = this.exportBills[i];
                this.exportBills[i] = this.exportBills[j];
                this.exportBills[j] = temp;
              }
            }
          }
        }
      }
    }else if(data === "import"){
      if(type === "confirmAt"){
        for(let i = 0;i<this.importBills.length;i++){
          for(let j = i + 1;j<this.importBills.length;j++){
            let dateI = new Date(this.importBills[i].confirmAt);
            let dateJ = new Date(this.importBills[j].confirmAt);
            if(this.sortType === "upper"){
              if(dateJ < dateI){
                let temp:IeBillInfor = this.importBills[i];
                this.importBills[i] = this.importBills[j];
                this.importBills[j] = temp;
              }
            }else{
              if(dateJ > dateI){
                let temp:IeBillInfor = this.importBills[i];
                this.importBills[i] = this.importBills[j];
                this.importBills[j] = temp;
              }
            }
          }
        }
      }else if(type === "createAt"){
        for(let i = 0;i<this.importBills.length;i++){
          for(let j = i + 1;j<this.importBills.length;j++){
            let dateI = new Date(this.importBills[i].createAt);
            let dateJ = new Date(this.importBills[j].createAt);
            if(this.sortType === "upper"){
              if(dateJ < dateI){
                let temp:IeBillInfor = this.importBills[i];
                this.importBills[i] = this.importBills[j];
                this.importBills[j] = temp;
              }
            }else{
              if(dateJ > dateI){
                let temp:IeBillInfor = this.importBills[i];
                this.importBills[i] = this.importBills[j];
                this.importBills[j] = temp;
              }
            }
          }
        }
      }else{
        for(let i = 0;i<this.importBills.length;i++){
          for(let j = i + 1;j<this.importBills.length;j++){
            let totalI = this.importBills[i].total;
            let totalJ = this.importBills[j].total;
            if(this.sortType === "upper"){
              if(totalJ < totalI){
                let temp:IeBillInfor = this.importBills[i];
                this.importBills[i] = this.importBills[j];
                this.importBills[j] = temp;
              }
            }else{
              if(totalJ > totalI){
                let temp:IeBillInfor = this.importBills[i];
                this.importBills[i] = this.importBills[j];
                this.importBills[j] = temp;
              }
            }
          }
        }
      }
    }else if(data === "goods"){
      if(type === "import"){
        for(let i = 0;i<this.goodsDetail.length;i++){
          for(let j = i + 1;j<this.goodsDetail.length;j++){
            let importI = this.goodsDetail[i].import;
            let importJ = this.goodsDetail[j].import;
            if(this.sortType === "upper"){
              if(importJ < importI){
                let temp:GoodsDetail = this.goodsDetail[i];
                this.goodsDetail[i] = this.goodsDetail[j];
                this.goodsDetail[j] = temp;
              }
            }else{
              if(importJ > importI){
                let temp:GoodsDetail = this.goodsDetail[i];
                this.goodsDetail[i] = this.goodsDetail[j];
                this.goodsDetail[j] = temp;
              }
            }
          }
        }
      }else{
        for(let i = 0;i<this.goodsDetail.length;i++){
          for(let j = i + 1;j<this.goodsDetail.length;j++){
            let exportI = this.goodsDetail[i].export;
            let exportJ = this.goodsDetail[j].export;
            if(this.sortType === "upper"){
              if(exportJ < exportI){
                let temp:GoodsDetail = this.goodsDetail[i];
                this.goodsDetail[i] = this.goodsDetail[j];
                this.goodsDetail[j] = temp;
              }
            }else{
              if(exportJ > exportI){
                let temp:GoodsDetail = this.goodsDetail[i];
                this.goodsDetail[i] = this.goodsDetail[j];
                this.goodsDetail[j] = temp;
              }
            }
          }
        }
      }
    }

    if(this.sortType === "upper"){
      this.sortType = "lower";
    }else{
      this.sortType = "upper";
    }

  }

  filter(type:string){
    if(type === "export"){
      this.exportBills = [];
      let inputValue:string = this.shopInput.nativeElement.value;
      if(inputValue.length <= 0){
        this.exportBills = this.exportLU;
      }else{
        this.exportBills = this.exportLU.filter((ie:IeBillInfor)=>{
          return this.api.removeAccents(ie.address).indexOf(this.api.removeAccents(inputValue)) != -1;
        });
      }
    }else{
      this.importBills = [];
      let inputValue:string = this.suppInput.nativeElement.value;
      if(inputValue.length <= 0){
        this.importBills = this.importLU;
      }else{
        this.importBills = this.importLU.filter((ie:IeBillInfor)=>{
          return this.api.removeAccents(ie.address).indexOf(this.api.removeAccents(inputValue)) != -1;
        });
      }
    }
  }
  showDetail(b:IeBillInfor) {
    this.bsMS.show(DetailOrderComponent,{
      initialState:{
        data:{
          ie:b,
          goods:this.goods,
        }
      }
    });
  }
  async confirmDate() {
    this.importBills = [];
    this.importLU = [];
    this.exportBills = [];
    this.exportLU = [];
    this.goodsDetail.forEach((gd:GoodsDetail)=>{
      gd.import = 0;
      gd.export = 0;
    });
    if (this.endDate === undefined || this.startDate === undefined) {
      alert('Thời gian không phù hợp, hãy thử lại !');
    } else {
      this.hide = false;
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
            if (ie.type === 'export' && ie.status === "confirm") {
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
              this.exportLU.push(ieBI);
            } else if (ie.type === 'import' && ie.status === "confirm") {
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
                          gd.import = gd.import + ied.num
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
              this.importLU.push(ieBI);
            }
          }
        });
    }
  }
}
