import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GroupEdittorComponent } from './group-edittor/group-edittor.component';
import { Group } from 'src/app/shared/Models/group';
import { ApiService } from 'src/app/core/service/api.service';
import { DataRequest } from 'src/app/shared/Interface/data_request';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  @ViewChild("searchInput",{read:ElementRef,static:true}) searchInput:ElementRef;

  groups:Array<Group> = [];
  groupsLU:Array<Group> = [];
  constructor(private bsModal:BsModalService,private api:ApiService) { }

  ngOnInit(): void {
    this.load();
  }
  load(){
    let request: DataRequest = {
      mode:"get",
      data:""
    };
    this.api.group(request).subscribe((res:any)=>{
      this.groups = res;
      this.groupsLU = res;
    });
  }
  addGroup(){
    this.bsModal.show(GroupEdittorComponent,{
      initialState:{
        data:{
          type:"create",
          data:0
        }
      }
    }).content?.respnose.subscribe((res:any)=>{
      if(res.status === "success"){
        this.groupsLU.push(res.data);
      }
    });
  }
  showGroup(g:Group){
    this.bsModal.show(GroupEdittorComponent,{
      initialState:{
        data:{
          type:"edit",
          data:g
        }
      }
    }).content?.respnose.subscribe((res:any)=>{
      if(res.status === "success"){
        this.groupsLU.forEach((g:Group)=>{
          if(g.id === res.data.id){
            g.name = res.data.name;
          }
        });
      }
    });
  }
  search(){
    let value:string  = this.searchInput.nativeElement.value;
    this.groups = [];
    if(value.length <= 0){
      this.groups = this.groupsLU;
    }else{
      this.groupsLU.forEach((g:Group)=>{
        if(this.api.removeAccents(g.name.toLowerCase()).indexOf(this.api.removeAccents(value.toLowerCase())) != -1){
          this.groups.push(g);
        }
      });
    }
  }
}
