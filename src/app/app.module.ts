import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ShopsComponent } from './features/shops/shops.component';
import { ItemsComponent } from './features/items/items.component';
import { GroupsComponent } from './features/groups/groups.component';
import { PolicysComponent } from './features/policys/policys.component';
import { PolicyEditorComponent } from './features/policys/policy-editor/policy-editor.component';
import { GroupEdittorComponent } from './features/groups/group-edittor/group-edittor.component';
import { ShopDetailsComponent } from './features/shops/shop-details/shop-details.component';
import { ShopListComponent } from './features/shops/shop-list/shop-list.component';
import { StaffEditorComponent } from './features/shops/shop-details/staff-editor/staff-editor.component';
import { ItemEditorComponent } from './features/items/item-editor/item-editor.component';
import { AddItemComponent } from './features/policys/policy-editor/add-item/add-item.component';
import { AdminReportComponent } from './features/admin-report/admin-report.component';
import { WarehouseModule } from './features/warehouse/warehouse.module';
import { ApiService } from './core/service/api.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ShopsComponent,
    ItemsComponent,
    GroupsComponent,
    PolicysComponent,
    PolicyEditorComponent,
    GroupEdittorComponent,
    ShopDetailsComponent,
    ShopListComponent,
    StaffEditorComponent,
    ItemEditorComponent,
    AddItemComponent,
    AdminReportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    WarehouseModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
