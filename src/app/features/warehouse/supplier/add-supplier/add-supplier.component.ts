import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/core/service/api.service';
import { Supplier } from 'src/app/shared/Models/supplier';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit {
  @Input() data:any;
  @Output() response = new EventEmitter();

  name:string;
  phone:string;

  constructor(private api:ApiService, private bsRef:BsModalRef) { }

  ngOnInit(): void {
    this.name  = this.data.sup.name;
    this.phone = this.data.sup.phone;
  }

  onSubmit(){
  if(this.data.type === "create"){
    let supp:Supplier = {
      id:0,
      name:this.name,
      phone:this.phone,
    };
    this.api.supplier({mode:"create",data:supp}).subscribe((res:any)=>{
      if(res.id != 0){
        alert("Thêm mới thành công !");
        this.response.emit({type:"create",data:res});
        this.bsRef.hide();
      }else{
        alert("Đã có lỗi xảy ra !");
      }
    });
  }else{
    let upSupp:Supplier = {
      id:this.data.sup.id,
      name:this.name,
      phone:this.phone
    };
    this.api.supplier({mode:"update",data:upSupp}).subscribe((res:any)=>{
      if(res.affected === 1){
        alert("Cập nhật thành công !");
        this.response.emit({type:"edit",data:upSupp});
        this.bsRef.hide();
      }else{
        alert("Đã có lỗi xảy ra !");
      }
    });
  }
  }
}
