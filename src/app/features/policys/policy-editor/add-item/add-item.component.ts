import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/core/service/api.service';
import { DataRequest } from 'src/app/shared/Interface/data_request';
import { Item } from 'src/app/shared/Models/item';


interface ItemEdit{
  id:number;
  policyID:number[];
  name:string
  price:number;
  groupID:number;
  isChosen:boolean;
  isEdit:boolean;
}

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  @Input() data:any;

  items:Array<ItemEdit> = [];

  constructor(private api:ApiService,private bs:BsModalService,private bsRef:BsModalRef) { }

  ngOnInit(): void {
    this.load();
  }
  load(){
    this.data.allItems.forEach((i:Item)=>{
      this.items.push({...i,isChosen:false,isEdit:false});
    });
    this.items.forEach((i:ItemEdit)=>{
      for(let j = 0 ; j < i.policyID.length; j++){
        if(i.policyID[j]  === this.data.pID){
          i.isChosen = true;
          break;
        }
      }
    });
  }
  updateItem(i:ItemEdit){
    if(i.isChosen === true){
      let index:number = i.policyID.indexOf(this.data.pID);
      i.policyID.splice(index,1);
      i.isChosen = false;
    }else{
      i.policyID.push(this.data.pID);
      i.isChosen = true;
    }
    let updateItem:Item = {
      id:i.id,
      policyID:i.policyID,
      name:i.name,
      price:i.price,
      groupID:i.groupID
    };
    let request:DataRequest = {
      mode:"update",
      data:updateItem
    };
    this.api.item(request).subscribe((res:any)=>{
      if(res.affected === 1){
        if(i.isChosen === false){
          alert("Bỏ món thành công !");
        }else{
          alert("Thêm món thành công !");
        }
      }else{
        alert("Đã có lỗi xảy ra !");
      }
    });
  }
  confrim(){
    this.bsRef.hide();
  }
}
