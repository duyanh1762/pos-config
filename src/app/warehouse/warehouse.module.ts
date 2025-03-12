import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierComponent } from './supplier/supplier.component';
import { GoodsComponent } from './goods/goods.component';
import { RouterModule, Routes } from '@angular/router';
import { AddSupplierComponent } from './supplier/add-supplier/add-supplier.component';
import { FormsModule } from '@angular/forms';
import { GoodsEditComponent } from './goods/goods-edit/goods-edit.component';
import { OrderComponent } from './order/order.component';
import { ReportComponent } from './report/report.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

let routes:Routes = [
  {path:"goods",component:GoodsComponent},
  {path:"supplier",component:SupplierComponent},
  {path:"order",component:OrderComponent},
  {path:"report",component:ReportComponent},
  {path:"",redirectTo:"goods",pathMatch:"full"},
  {path:"**",redirectTo:"",pathMatch:"full"}
]

@NgModule({
  declarations: [
    SupplierComponent,
    GoodsComponent,
    AddSupplierComponent,
    GoodsEditComponent,
    OrderComponent,
    ReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ]
})
export class WarehouseModule { }
