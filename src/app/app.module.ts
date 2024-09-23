import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ShopsComponent } from './shops/shops.component';
import { ItemsComponent } from './items/items.component';
import { GroupsComponent } from './groups/groups.component';
import { PolicysComponent } from './policys/policys.component';
import { ApiService } from './service/api.service';
import { PolicyEditorComponent } from './policys/policy-editor/policy-editor.component';
import { GroupEdittorComponent } from './groups/group-edittor/group-edittor.component';
import { ShopDetailsComponent } from './shops/shop-details/shop-details.component';
import { ShopListComponent } from './shops/shop-list/shop-list.component';
import { StaffEditorComponent } from './shops/shop-details/staff-editor/staff-editor.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
