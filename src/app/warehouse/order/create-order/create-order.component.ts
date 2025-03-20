import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataRequest } from 'src/app/Interface/data_request';
import { Goods } from 'src/app/Models/goods';
import { IeBill } from 'src/app/Models/ie_bill';
import { IeDetail } from 'src/app/Models/ie_detail';
import { Supplier } from 'src/app/Models/supplier';
import { ApiService } from 'src/app/service/api.service';

interface IeDetailInfor {
  id: number;
  itemID: number;
  num: number;
  ieID: number;
  note: string;
  price: number;
  name: string;
  unit: string;
}

interface GoodsInfor {
  id: number;
  name: string;
  unit: string;
  groupID: number;
  price: number;
  remaining: number;
  isChoose: boolean;
}

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  @ViewChild("searchInput",{read:ElementRef,static:true}) searchInput:ElementRef;

  date: String;
  goods: Array<GoodsInfor> = [];
  goodsLU: Array<GoodsInfor> = [];
  cart: Array<IeDetailInfor> = [];
  total: number = 0;
  type: string = 'create'; //edit || create
  suppliers:Array<Supplier> = [];
  supplierID:number = 0;

  constructor(private api:ApiService,private router:Router) { }

  ngOnInit(): void {
    this.load();
  }

  async load() {
    let splitDate: Array<string> = this.api.getCurrentDateTime().split(" ")[0].split("-");
    this.date = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
    let request: DataRequest = {
      mode: 'get',
      data: '',
    };
    await this.api
      .goods(request)
      .toPromise()
      .then((res: any) => {
        res.forEach((g: Goods) => {
          this.goods.push({ ...g, isChoose: false });
          this.goodsLU.push({ ...g, isChoose: false });
        });
      });
    await this.api.supplier(request).toPromise().then((res:any)=>{
      this.suppliers = res;
    });
    if(localStorage.getItem("goods-infor")){
      let g:Goods = JSON.parse(localStorage.getItem("goods-infor") || "");
      let newCI:IeDetailInfor = {
        id: 0,
        itemID: g.id,
        num: 1,
        ieID: 0,
        note: "",
        price: g.price,
        name: g.name,
        unit: g.unit
      };
      this.cart.push(newCI);
      this.getTotal();
      this.changeStatusGoods(g.id,true);
    }
  }
  getName(gID: number): string {
    let n: string = '';
    this.goods.forEach((g: Goods) => {
      if (g.id === gID) {
        n = g.name;
      }
    });
    return n;
  }
  getPrice(gID: number): number {
    let p: number = 0;
    this.goods.forEach((g: Goods) => {
      if (g.id === gID) {
        p = g.price;
      }
    });
    return p;
  }
  getUnit(gID: number): string {
    let u: string = '';
    this.goods.forEach((g: Goods) => {
      if (g.id === gID) {
        u = g.unit;
      }
    });
    return u;
  }
  changeStatusGoods(idG: number, status: boolean) {
    this.goods.forEach((g: GoodsInfor) => {
      if (g.id === idG) {
        g.isChoose = status;
      }
    });
    this.goodsLU.forEach((g: GoodsInfor) => {
      if (g.id === idG) {
        g.isChoose = status;
      }
    });
  }
  getTotal() {
    this.total = 0;
    this.cart.forEach((ieD: IeDetailInfor) => {
      this.total = this.total + ieD.price * ieD.num;
    });
  }
  addCart(g:GoodsInfor){
    let newCI:IeDetailInfor = {
      id: 0,
      itemID: g.id,
      num: 1,
      ieID: 0,
      note: "",
      price: g.price,
      name: g.name,
      unit: g.unit
    };
    let isExist:boolean = false
    this.cart.forEach((ci:IeDetail)=>{
      if(ci.itemID === g.id){
        ci.num = 1;
        isExist = true;
      }
    });
    if(isExist === false){
      this.cart.push(newCI);
    }
    this.getTotal();
    this.changeStatusGoods(g.id,true);
  }
  delete(ied:IeDetailInfor){
    let index:number = this.cart.indexOf(ied);
    this.cart[index].num = 0;
    this.getTotal();
    this.changeStatusGoods(ied.itemID,false);
  }
  search(){
    let searchValue:string = this.searchInput.nativeElement.value;
    this.goods = [];
    if(searchValue.length <= 0){
      this.goods = this.goodsLU;
    }else{
      this.goodsLU.forEach((g:GoodsInfor)=>{
        if(this.api.removeAccents(g.name.toLowerCase()).indexOf(this.api.removeAccents(searchValue.toLowerCase())) != -1){
          this.goods.push(g);
        }
      });
    }
  }
  save(){
      let acceptItems:Array<IeDetailInfor> = this.cart.filter((ci:IeDetailInfor)=>{
        return ci.num > 0;
      });
      if(acceptItems.length <= 0){
        alert("Chọn ít nhất 1 mặt hàng để lưu đơn !")
      }else{
        let newIE:IeBill = {
          id:0,
          createAt: this.api.getCurrentDateTime(),
          confirmAt: this.api.getCurrentDateTime(),
          staffID:0,
          shopID:Number(this.supplierID),
          status:"confirm",
          type:"import"
        };
        let request:DataRequest = {
          mode:"create",
          data:newIE
        };
        console.log(newIE);
        console.log(this.cart);
        this.api.ieBill(request).subscribe((res:any)=>{
          if(res.id != undefined && res.id !=0 && res.id != null){
            this.cart.forEach((ci:IeDetailInfor)=>{
              if(ci.num > 0){
                let ieDetai:IeDetail = {
                  id:ci.id,
                  itemID:ci.itemID,
                  num:ci.num,
                  note:ci.note,
                  ieID:res.id
                };
                this.api.ieDetail({mode:"create",data:ieDetai}).subscribe((res:any)=>{
                  this.goods.forEach((g:GoodsInfor)=>{
                    if(res.itemID === g.id){
                      g.remaining = g.remaining + res.num;
                      let uGoods:Goods = {
                        id:g.id,
                        name:g.name,
                        price:g.price,
                        unit:g.unit,
                        groupID:g.groupID,
                        remaining:g.remaining
                      };
                      this.api.goods({mode:"update",data:uGoods}).subscribe((res:any)=>{});
                    }
                  });
                });
              }
            });
            alert("Tạo thành công !");
            this.router.navigate(["/home/warehouse/order"]);
            localStorage.removeItem("goods-infor");
          }else{
            alert("Đã có lỗi ra, hãy thử lại!");
          }
        });
      }
  }
  back(){
    this.router.navigate(["/home/warehouse/order"]);
    localStorage.removeItem("goods-infor");
  }
}
