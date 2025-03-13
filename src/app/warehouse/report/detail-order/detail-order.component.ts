import { Component, Input, OnInit } from '@angular/core';
import { Goods } from 'src/app/Models/goods';
import { IeDetail } from 'src/app/Models/ie_detail';
import { ApiService } from 'src/app/service/api.service';

export class IeDetailInfor {
  id: number
  itemID: number;
  num: number;
  ieID:number;
  note:string;
  name:string;
  unit:string;
}

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.css']
})
export class DetailOrderComponent implements OnInit {
  @Input() data:any;
  listDetail:Array<IeDetailInfor> = [];

  constructor(public api:ApiService) { }

  ngOnInit(): void {
    this.load();
  }
  async load(){
    await this.api.ieDetail({mode:"get",data:this.data.ie.id}).toPromise().then((res:any)=>{
      res.forEach((ied:IeDetail)=>{
        let n:string = "";
        let u:string = "";
        this.data.goods.forEach((g:Goods)=>{
          if(ied.itemID === g.id){
            n = g.name;
            u = g.unit;
          }
        });
        let inforDetail : IeDetailInfor = {
          ...ied,
          name:n,
          unit:u,
        };
        this.listDetail.push(inforDetail);
      });
    });
  }
}
