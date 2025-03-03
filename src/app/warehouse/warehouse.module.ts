import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierComponent } from './supplier/supplier.component';
import { GoodsComponent } from './goods/goods.component';
import { RouterModule, Routes } from '@angular/router';
import { AddSupplierComponent } from './supplier/add-supplier/add-supplier.component';
import { FormsModule } from '@angular/forms';
import { GoodsEditComponent } from './goods/goods-edit/goods-edit.component';

let routes:Routes = [
  {path:"goods",component:GoodsComponent},
  {path:"supplier",component:SupplierComponent},
  {path:"",redirectTo:"goods",pathMatch:"full"},
  {path:"**",redirectTo:"",pathMatch:"full"}
]

@NgModule({
  declarations: [
    SupplierComponent,
    GoodsComponent,
    AddSupplierComponent,
    GoodsEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class WarehouseModule { }
