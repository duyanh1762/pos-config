import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataRequest } from 'src/app/Interface/data_request';
import { Item } from 'src/app/Models/item';
import { Policy } from 'src/app/Models/policy';
import { ApiService } from 'src/app/service/api.service';
import { AddItemComponent } from './add-item/add-item.component';
interface DataInput {
  type: string; // create | edit
  data: number | Policy | any;
}
@Component({
  selector: 'app-policy-editor',
  templateUrl: './policy-editor.component.html',
  styleUrls: ['./policy-editor.component.css'],
})
export class PolicyEditorComponent implements OnInit {
  @Input() data: DataInput;
  @Output() response = new EventEmitter();
  name: string = '';
  descreption: string = '';
  date:string = '';
  items: Array<Item> = [];
  itemsLU:Array<Item> = [];
  constructor(private api: ApiService, private bsModalRef: BsModalRef,private bs:BsModalService) {}

  ngOnInit(): void {
    this.load();
  }
  async load() {
    if (this.data.type === 'edit') {
      let request: DataRequest = {
        mode: 'get',
        data: '',
      };
      await this.api
        .item(request)
        .toPromise()
        .then((res: any) => {
          this.itemsLU = res;
          res.forEach((i: Item) => {
            i.policyID.forEach((pID:number)=>{
              if (pID=== this.data.data.id) {
                this.items.push(i);
              }
            });
          });
        });
      this.name = this.data.data.name;
      this.descreption = this.data.data.des;
      this.date = this.api.dateTransform(this.data.data.date);
    }
  }
  onSubmit() {
    if (this.data.type === 'create') {
      let newPolicy: Policy = {
        id: 0,
        name: this.name,
        des: this.descreption,
        date: this.api.getCurrentDateTime(),
      };
      let request: DataRequest = {
        mode: 'create',
        data: newPolicy,
      };
      this.api.policy(request).subscribe((res: any) => {
        if (res.result) {
          alert('Thêm không thành công , có lỗi xảy ra !');
        } else {
          alert('Thêm thành công !');
          this.response.emit({
            data: res,
            status: 'success',
          });
          this.bsModalRef.hide();
        }
      });
    } else {
      let updatePolicy:Policy = {
        id: this.data.data.id,
        name:this.name,
        des:this.descreption,
        date:this.api.dateTransform(this.data.data.date),
      };
      let request:DataRequest = {
        mode:"update",
        data:updatePolicy
      };
      this.api.policy(request).subscribe((res:any)=>{
        if(res.affected === 1){
          alert("Cập nhật thành công !");
          this.response.emit({
            data:updatePolicy,
            status:"success",
          });
          this.bsModalRef.hide();
        }else{
          alert("Cập nhật thất bại , có lỗi xảy ra !");
        }
      });
    }
  }
  addItem(){
    this.bs.show(AddItemComponent,{
      initialState:{
        data:{
          currentItems:this.items,
          allItems:this.itemsLU,
          policy:this.name,
          pID:this.data.data.id
        }
      }
    });
    this.bsModalRef.hide();
  }
}
