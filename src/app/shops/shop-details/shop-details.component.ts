import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DataRequest } from 'src/app/Interface/data_request';
import { Policy } from 'src/app/Models/policy';
import { Shop } from 'src/app/Models/shop';
import { Staff } from 'src/app/Models/staff';
import { ApiService } from 'src/app/service/api.service';
import { StaffEditorComponent } from './staff-editor/staff-editor.component';
interface DataInput {
  handle: string | null; // true | false
  type: string | null; //  edit | create
  data: Shop | any | null;
}
@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css'],
})
export class ShopDetailsComponent implements OnInit {
  data: DataInput;
  address: string = '';
  name: string = '';
  password: string = '';
  table: number = 0;
  policyID: number = 0;
  policies: Array<Policy> = [];
  staffs:Array<Staff> = [];

  constructor(private api: ApiService, private router: Router , private bsModal:BsModalService) {}

  ngOnInit(): void {
    this.load();
  }
  async load() {
    let request: DataRequest = {
      mode: 'get',
      data: '',
    };
    this.data = {
      handle: localStorage.getItem('shop-handle'),
      type: localStorage.getItem('shop-type'),
      data: JSON.parse(localStorage.getItem('shop-infor') || '{}'),
    };
    await this.api.policy(request).toPromise().then((res:any)=>{
      this.policies = res;
    });
    await this.api.staff(request).toPromise().then((res:any)=>{
      res.forEach((s:Staff)=>{
        if(s.shopID === this.data.data.id){
          this.staffs.push(s);
        }
      });
    });
    if (this.data.handle === null || this.data.type === null) {
      this.back();
    } else {
      if (this.data.type === 'edit') {
        this.address = this.data.data.address;
        this.name = this.data.data.name;
        this.password = this.data.data.password;
        this.policyID = this.data.data.policyID;
        this.table = this.data.data.number_table;
      }
    }
  }
  back() {
    this.router.navigate(['/home/shops']);
  }
  addSatff(){
    this.bsModal.show(StaffEditorComponent,{
      initialState:{
        data:{
          type:"create",
          data:0,
          shopData:this.data.data,
        }
      }
    }).content?.responsive.subscribe((res:any)=>{
      if(res.status === "success"){
        this.staffs.push(res.data);
      }
    });
  }
  showStaff(s:Staff){
    this.bsModal.show(StaffEditorComponent,{
      initialState:{
        data:{
          type:"edit",
          data:s,
          shopData:this.data.data,
        }
      }
    }).content?.responsive.subscribe((res:any)=>{
      if(res.status === "success"){
        console.log(res.data);
        this.staffs.forEach((s:Staff)=>{
          if(s.id === res.data.id){
            console.log("1")
            s.name = res.data.name;
            s.password = res.data.password;
            s.role = res.data.role;
            s.status = res.data.status;
          }
        });
      }
    });
  }
  onSubmit(){
    // To do here..... create xong thi set lai gia tri cho localStorage
  }
}