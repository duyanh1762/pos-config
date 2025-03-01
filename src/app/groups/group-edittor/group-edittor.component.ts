import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DataRequest } from 'src/app/Interface/data_request';
import { Group } from 'src/app/Models/group';
import { Item } from 'src/app/Models/item';
import { ApiService } from 'src/app/service/api.service';
interface DataInput {
  type: string; // create | edit
  data: number | Group | any;
}
@Component({
  selector: 'app-group-edittor',
  templateUrl: './group-edittor.component.html',
  styleUrls: ['./group-edittor.component.css'],
})
export class GroupEdittorComponent implements OnInit {
  @Input() data: DataInput;
  @Output() respnose = new EventEmitter();

  name: string = '';
  type: string = '';
  items: Array<Item> = [];
  constructor(private api: ApiService, private bsModalRef: BsModalRef) {}

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
          res.forEach((i: Item) => {
            if (i.groupID === this.data.data.id) {
              this.items.push(i);
            }
          });
        });
      this.name = this.data.data.name;
      this.type = this.data.data.type
    }
  }
  onSubmit(){
    if(this.data.type === "create"){
      let newGroup:Group = {
        id:0,
        name:this.name,
        type:this.type
      };
      let request: DataRequest = {
        mode:"create",
        data:newGroup
      };
      this.api.group(request).subscribe((res:any)=>{
        if(res.result){
          alert("Thêm không thành công , đã có lỗi xảy ra !");
        }else{
          alert("Thêm thành công !");
          this.respnose.emit({data:res,status:"success"});
          this.bsModalRef.hide();
        }
      });
    }else{
      let updateGroup:Group = {
        id:this.data.data.id,
        name:this.name,
        type:this.type
      };
      let request:DataRequest = {
        mode:"update",
        data:updateGroup
      };
      this.api.group(request).subscribe((res:any)=>{
        if(res.affected === 1){
          alert("Cập nhật thành công !");
          this.respnose.emit({data:updateGroup,status:"success"});
          this.bsModalRef.hide();
        }else{
          alert("Cập nhật thất bại , có lỗi xảy ra !");
        }
      });
    }
  }
}
