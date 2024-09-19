import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Policy } from '../Models/policy';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PolicyEditorComponent } from './policy-editor/policy-editor.component';

@Component({
  selector: 'app-policys',
  templateUrl: './policys.component.html',
  styleUrls: ['./policys.component.css']
})
export class PolicysComponent implements OnInit {
  policies:Array<Policy> = [];
  constructor(private api:ApiService,private bsModal:BsModalService) { }

  ngOnInit(): void {
    this.load();
  }
  load(){
    let request = {
      mode:"get",
      data:""
    };
    this.api.policy(request).subscribe((res:any)=>{
      this.policies = res;
    });
  }
  addPolicy(){
    this.bsModal.show(PolicyEditorComponent,{
      initialState:{
        data:{
          type:"create",
          data:0,
        }
      }
    }).content?.response.subscribe((res:any)=>{
      if(res.status === "success"){
        this.policies.push(res.data);
      }
    });
  }
  showPolicy(p:Policy){
    this.bsModal.show(PolicyEditorComponent,{
      initialState:{
        data:{
          type:"edit",
          data:p
        }
      }
    }).content?.response.subscribe((res:any)=>{
      if(res.status === "success"){
        this.policies.forEach((p:Policy)=>{
          if(res.data.id === p.id){
            p.name = res.data.name;
            p.des = res.data.des;
          }
        });
      }
    });
  }
}
