import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Goods } from 'src/app/Models/goods';
import { Group } from 'src/app/Models/group';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-goods-edit',
  templateUrl: './goods-edit.component.html',
  styleUrls: ['./goods-edit.component.css']
})
export class GoodsEditComponent implements OnInit {
  @Input() data:any;
  @Output() response = new EventEmitter();

  groups:Array<Group> = [];
  name:string = "";
  price:number = 0;
  unit:string = "";
  groupID:number = 0;

  constructor(private api:ApiService, private bsRef:BsModalRef) { }

  ngOnInit(): void {
    this.load();
  }

  async load(){
    await this.api.group({mode:"get",data:""}).toPromise().then((res:any)=>{
      res.forEach((g:Group)=>{
        if(g.type === "warehouse"){
          this.groups.push(g);
        }
      });
    });
    if(this.data.type === "edit"){
      this.name = this.data.data.name;
      this.price = this.data.data.price;
      this.unit = this.data.data.unit;
      this.groupID = this.data.data.groupID;
    }
  }
  onSubmit(){
    if(this.data.type === "create"){
      let newGoods:Goods = {
        id:0,
        name:this.name,
        price:this.price,
        remaining:0,
        groupID:this.groupID,
        unit:this.unit,
      };
      this.api.goods({mode:"create",data:newGoods}).subscribe((res:any)=>{
        if(res.id != 0){
          alert("Thêm mới thành công !");
          this.response.emit({type:"create",data:res});
          this.bsRef.hide();
        }else{
          alert("Đã có lỗi xảy ra !");
        }
      });
    }else{
      let updateGoods:Goods = {
        id:this.data.data.id,
        name:this.name,
        price:this.price,
        remaining:this.data.data.remaining,
        groupID:this.groupID,
        unit:this.unit,
      };
      this.api.goods({mode:"update",data:updateGoods}).subscribe((res:any)=>{
        if(res.affected === 1){
          this.response.emit({type:"edit",data:updateGoods});
          this.bsRef.hide();
          alert("Cập nhật thành công !");
        }else{
          alert("Đã có lỗi xảy ra !");
        }
      });
    }
  }

}
