import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsComponentRef } from 'ngx-bootstrap/component-loader';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataRequest } from 'src/app/Interface/data_request';
import { Shop } from 'src/app/Models/shop';
import { Staff } from 'src/app/Models/staff';
import { ApiService } from 'src/app/service/api.service';
interface DataInput{
  type:string // create | edit
  data:Staff | null | any | number;
  shopData:Shop | null | any |number;
}
@Component({
  selector: 'app-staff-editor',
  templateUrl: './staff-editor.component.html',
  styleUrls: ['./staff-editor.component.css']
})
export class StaffEditorComponent implements OnInit {
  @Input() data:DataInput;
  @Output() responsive = new EventEmitter();

  name:string = "";
  password:string = "";
  role:string = "";
  status:string = "";

  constructor(private api:ApiService,private bsModal:BsModalService,private bsRef:BsModalRef) { }

  ngOnInit(): void {
    this.load();
  }
  load(){
    if(this.data.type === "edit"){
      this.name = this.data.data.name;
      this.password = this.data.data.password;
      this.role = this.data.data.role;
      this.status = this.data.data.status;
    }
    console.log(this.data.shopData);
  }
  onSubmit(){
    if(this.name.length <=0 || this.password.length <=0 || this.role.length <= 0 || this.status.length <= 0){
      alert("Hãy nhập đầy đủ thông tin !");
    }else{
      if(this.data.type === "create"){
        let newStaff:Staff = {
          id:0,
          name:this.name,
          password:this.password,
          role:this.role,
          status:this.status,
          shopID:this.data.shopData.id
        };
        let request:DataRequest = {
          mode:"create",
          data:newStaff
        };
        this.api.staff(request).subscribe((res:any)=>{
          if(res.id){
            alert("Thêm thành công !");
            this.responsive.emit({status:"success",data:res});
            this.bsRef.hide();
          }else{
            alert("Thêm thất bại , đã có lỗi xảy ra !");
          }
        });
      }else{
        let updateStaff:Staff = {
          id:this.data.data.id,
          name:this.name,
          password:this.password,
          role:this.role,
          status:this.status,
          shopID:this.data.shopData.id
        };
        let request:DataRequest = {
          mode:"update",
          data:updateStaff
        };
        this.api.staff(request).subscribe((res:any)=>{
          if(res.affected === 1){
            alert("Cập nhật thành công !");
            this.responsive.emit({status:"success",data:updateStaff});
            this.bsRef.hide();
          }else{
            alert("Cập nhật thất bại , đã có lỗi xảy ra !");
          }
        });
      }
    }
  }
}
