import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PolicyEditorComponent } from './policy-editor/policy-editor.component';
import { Policy } from 'src/app/shared/Models/policy';
import { ApiService } from 'src/app/core/service/api.service';

@Component({
  selector: 'app-policys',
  templateUrl: './policys.component.html',
  styleUrls: ['./policys.component.css']
})
export class PolicysComponent implements OnInit {
  @ViewChild("searchInput",{read:ElementRef,static:true}) searchInput:ElementRef;

  policies:Array<Policy> = [];
  policiesLU:Array<Policy> = [];
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
      this.policiesLU = res;
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
        this.policiesLU.push(res.data);
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
        this.policiesLU.forEach((p:Policy)=>{
          if(res.data.id === p.id){
            p.name = res.data.name;
            p.des = res.data.des;
          }
        });
      }
    });
  }
  search(){
    let value:string = this.searchInput.nativeElement.value;
    this.policies = [];
    if(value.length <= 0){
      this.policies = this.policiesLU;
    }else{
      this.policiesLU.forEach((p:Policy)=>{
        if(this.api.removeAccents(p.name.toLowerCase()).indexOf(this.api.removeAccents(value.toLowerCase())) != -1){
          this.policies.push(p);
        }
      });
    }
  }
}
