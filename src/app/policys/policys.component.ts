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
    this.bsModal.show(PolicyEditorComponent);
  }
}
