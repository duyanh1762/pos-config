import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DataRequest } from 'src/app/Interface/data_request';
import { Group } from 'src/app/Models/group';
import { Item } from 'src/app/Models/item';
import { Policy } from 'src/app/Models/policy';
import { ApiService } from 'src/app/service/api.service';

interface DataInput{
  type:string, // create | edit
  data:Item | number | any
}

@Component({
  selector: 'app-item-editor',
  templateUrl: './item-editor.component.html',
  styleUrls: ['./item-editor.component.css']
})
export class ItemEditorComponent implements OnInit {
  @Input() data:DataInput;
  @Output() response = new EventEmitter();

  policies:Array<Policy> = [];
  groups:Array<Group> = [];

  name:string = "";
  price:number = 0;
  // policyID:number | null = null;
  groupID:number | null = null;

  constructor(private api:ApiService , private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.load();
  }
  async load(){
    let request:DataRequest = {
      mode:"get",
      data:""
    };
    await this.api.policy(request).toPromise().then((res:any)=>{this.policies = res});
    await this.api.group(request).toPromise().then((res:any)=>{this.groups = res.filter((g:Group)=>{ return g.type === "item"})});
    if(this.data.type === "edit"){
      this.name = this.data.data.name;
      this.price = this.data.data.price;
      // this.policyID = this.data.data.policyID;
      this.groupID = this.data.data.groupID;
    }
  }
  onSubmit(){
    if(this.data.type === "create"){
      let newItem : Item = {
        id:0,
        name:this.name,
        price:this.price,
        groupID:Number(this.groupID),
        policyID:[0],
      };
      let request:DataRequest = {
        mode:"create",
        data:newItem
      };
      this.api.item(request).subscribe((res:any)=>{
        if(res.result){
          alert("Thêm thất bại,đã có lỗi xảy ra !");
        }else{
          alert("Thêm thảnh công !");
          this.response.emit({status:"success",data:res});
          this.bsModalRef.hide();
        }
      });
    }else{
      let updItem : Item = {
        id:this.data.data.id,
        name:this.name,
        price:this.price,
        groupID:Number(this.groupID),
        policyID:this.data.data.policyID,
      };
      let request:DataRequest = {
        mode:"update",
        data:updItem
      };
      this.api.item(request).subscribe((res:any)=>{
        if(res.affected === 1){
          alert("Cập nhật thảnh công !");
          this.response.emit({status:"success",data:updItem});
          this.bsModalRef.hide();
        }else{
          alert("Cập nhật thất bại,đã có lỗi xảy ra !");
        }
      });
    }
  }
}
