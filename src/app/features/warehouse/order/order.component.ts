import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/core/service/api.service';
import { DataRequest } from 'src/app/shared/Interface/data_request';
import { Goods } from 'src/app/shared/Models/goods';
import { IeBill } from 'src/app/shared/Models/ie_bill';
import { IeDetail } from 'src/app/shared/Models/ie_detail';
import { Shop } from 'src/app/shared/Models/shop';
import { Staff } from 'src/app/shared/Models/staff';
import { Supplier } from 'src/app/shared/Models/supplier';


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
  address:string = "";
  user:string = "";
  edited:boolean = false;
  idExport:number = 0;

  constructor(public api:ApiService,private bsMS:BsModalService,private router: Router) { }

  ngOnInit(): void {
    this.load();
  }

  async load(){
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
    await this.api.supplier(request).toPromise().then((res:any)=>{
      this.suppliers = res;
    });
    this.resetBills();
  }
 async getExportInfor(exBill:IeBillInfor){
  if(this.edited === true){
    alert("Hãy lưu lại hoá đơn hiện tại trước khi chọn hoá đơn khác");
  }else{
    this.exportDetail = [];
    this.totalBill = 0;
    this.address = exBill.address;
    this.user = exBill.staff;
    this.idExport = exBill.id;
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

  onInputChange(){
    this.edited = true;
    this.getTottalBill();
  }
  delete(ied:DetailInfor){
    this.edited = true;
    this.exportDetail.forEach((d:DetailInfor)=>{
      if(d.id === ied.id){
        d.num = 0;
      }
    });
    this.getTottalBill();
  }
 async update(){
    if(this.edited === true){
      let newExportList:Array<DetailInfor> = this.exportDetail.filter((d:DetailInfor)=>{
        return d.num > 0;
      });
      if(newExportList.length > 0){
        let ied:DetailInfor;
        for(ied of this.exportDetail){
          if(ied.num > 0){
            let uIeDetail:IeDetail = {
              id:ied.id,
              itemID:ied.itemID,
              num:ied.num,
              note:ied.note,
              ieID:ied.ieID
            };
            this.api.ieDetail({mode:"update",data:uIeDetail}).subscribe((res:any)=>{
              if(res.affected !=1){
                alert("Đã có lỗi xảy ra !");
              }
            });
          }else{
            let deleteID:number = ied.id;
            this.api.ieDetail({mode:"delete",data:deleteID}).subscribe((res:any)=>{});
          }
        };
        this.resetBills();
        alert("Cập nhật thành công !")
        this.edited = false;
      }else{
        if(confirm("Bạn muốn huỷ đơn xuất này ?")){
          for(let b of this.exportBills){
            if(b.id === this.idExport){
              let uIE:IeBill = {
                id: b.id,
                createAt: b.createAt,
                confirmAt: b.confirmAt,
                staffID: b.staffID,
                shopID: b.shopID,
                status: "delete",
                type: b.type
              };
              await this.api.ieBill({mode:"update",data:uIE}).toPromise().then((res:any)=>{
                if(res.affected === 1){
                  alert("Huỷ đơn xuất thành công !");
                  this.exportDetail = [];
                  this.totalBill = 0;
                  this.address = "";
                  this.user = "";
                  this.idExport = 0;
                }
              });
            }
          }
          this.resetBills();
          this.edited = false;
        }else{
          this.edited = false;
        }
      }
    }
  }
  async resetBills(){
    this.goods = [];
    this.exportBills = [];
    this.GoodsInfor = [];
    let goodsFilter:Array<GoodsDetail>= [];
    await this.api.goods({mode:"get",data:""}).toPromise().then((res:any)=>{
      this.goods = res;
    });
    this.goods.forEach((g:Goods)=>{
      goodsFilter.push({...g,export:0});
    });
    await this.api.ieBill({mode:"get",data:""}).toPromise().then(async (res:any)=>{
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

  getTottalBill():number{
    this.totalBill = 0;
    this.exportDetail.forEach((d:DetailInfor)=>{
      this.goods.forEach((g:Goods)=>{
        if(g.id === d.itemID){
          this.totalBill = this.totalBill + d.num * g.price;
        }
      });
    });
    return this.totalBill;
  }
  async confirmBill(ex:IeBillInfor){
    if(confirm("Bạn muốn xác nhận đơn xuất đến địa chỉ: " + ex.address + " ?")){
      for(let d of this.exportDetail){
        for(let g of this.goods){
          if(d.itemID === g.id){
            g.remaining = g.remaining - d.num;
            if(g.remaining <= 0){
              g.remaining = 0;
            }
            this.api.goods({mode:"update",data:g}).subscribe((res:any)=>{});
          }
        };
      };
      let uExport:IeBill = {
        id: ex.id,
        createAt: ex.createAt,
        confirmAt: this.api.getCurrentDateTime(),
        staffID: ex.staffID,
        shopID: ex.shopID,
        status: "confirm",
        type: ex.type
      }
      await this.api.ieBill({mode:"update",data:uExport}).toPromise().then((res:any)=>{
        if(res.affected === 1){
          alert("Đã xác nhận đơn xuất !");
          this.resetBills();
          this.exportDetail = [];
          this.totalBill = 0;
          this.address = "";
          this.user = "";
          this.idExport = 0;
        }else{
          alert("Đã có lỗi xảy ra !");
        }
      });
    }
  }
  createImport(g:Goods){
    if(localStorage.getItem("goods-infor")){
      localStorage.removeItem("goods-infor");
    }
    localStorage.setItem("goods-infor",JSON.stringify(g));
    this.router.navigate(["/home/warehouse/order/create"]);
  }
}
