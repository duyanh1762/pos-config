import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Item } from '../Models/item';
import { ApiService } from '../service/api.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DataRequest } from '../Interface/data_request';
import { ItemEditorComponent } from './item-editor/item-editor.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  @ViewChild("searchInput",{read:ElementRef,static:true}) searchInut:ElementRef;

  items:Array<Item> = [];
  itemsLU:Array<Item> = [];

  constructor(private api:ApiService , private bsModal: BsModalService) { }

  ngOnInit(): void {
    this.load();
  }
  load(){
    let request:DataRequest = {
      mode:"get",
      data:""
    };
    this.api.item(request).subscribe((res:any)=>{
      this.items = [...res];
      this.itemsLU = [...res];
    });
  }
  search(){
    this.items = [];
    let value:string = this.searchInut.nativeElement.value;
    if(value.length <=0){
      this.items = this.itemsLU;
    }else{
      this.itemsLU.forEach((i:Item)=>{
        if(this.api.removeAccents(i.name.toLowerCase()).indexOf(this.api.removeAccents(value.toLowerCase())) != -1){
          this.items.push(i);
        }
      });
    }
  }
  addItem(){
    this.bsModal.show(ItemEditorComponent,{
      initialState:{
        data:{
          type:"create",
          data:0
        }
      }
    }).content?.response.subscribe((res:any)=>{
      if(res.status === "success"){
        this.items.push(res.data);
        this.itemsLU.push(res.data);
      }
    });
  }
  showItem(i:Item){
    this.bsModal.show(ItemEditorComponent,{
      initialState:{
        data:{
          type:"edit",
          data:i
        }
      }
    }).content?.response.subscribe((res:any)=>{
      if(res.status === "success"){
        this.items.forEach((i:Item)=>{
          if(res.data.id === i.id){
            i.name = res.data.name;
            i.price = res.data.price;
            i.policyID = res.data.policyID;
            i.groupID = res.data.groupID
          }
        });
        this.itemsLU.forEach((i:Item)=>{
          if(res.data.id === i.id){
            i.name = res.data.name;
            i.price = res.data.price;
            i.policyID = res.data.policyID;
            i.groupID = res.data.groupID
          }
        });

      }
    });
  }
}
