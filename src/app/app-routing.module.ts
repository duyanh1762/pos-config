import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './core/guard/auth-guard/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { LoginGuard } from './core/guard/login-guard/login.guard';
import { ShopsComponent } from './features/shops/shops.component';
import { IsAdminGuard } from './core/guard/isAdmin/is-admin.guard';
import { ShopListComponent } from './features/shops/shop-list/shop-list.component';
import { ShopDetailsComponent } from './features/shops/shop-details/shop-details.component';
import { ItemsComponent } from './features/items/items.component';
import { GroupsComponent } from './features/groups/groups.component';
import { PolicysComponent } from './features/policys/policys.component';
import { AdminReportComponent } from './features/admin-report/admin-report.component';
import { IsWareHouseGuard } from './core/guard/isWarehouse/is-ware-house.guard';


const routes: Routes = [
  {path:"login", component:LoginComponent,canActivate:[AuthGuard]},
  {path:"home",component:HomeComponent,canActivate:[LoginGuard],children:[
    {path:"shops",component:ShopsComponent,canActivate:[LoginGuard,IsAdminGuard],children:[
      {path:"",component:ShopListComponent,canActivate:[LoginGuard,IsAdminGuard]},
      {path:"details",component:ShopDetailsComponent,canActivate:[LoginGuard,IsAdminGuard]}
    ]},
    {path:"items",component:ItemsComponent,canActivate:[LoginGuard,IsAdminGuard]},
    {path:"groups",component:GroupsComponent,canActivate:[LoginGuard,IsAdminGuard]},
    {path:"policys",component:PolicysComponent,canActivate:[LoginGuard,IsAdminGuard]},
    {path:"statistic",component:AdminReportComponent,canActivate:[LoginGuard,IsAdminGuard]},
    {path:"warehouse",loadChildren:() =>
      import('./features/warehouse/warehouse.module').then((m) => m.WarehouseModule),canLoad:[IsWareHouseGuard]},
    {path:"",redirectTo:"shops",pathMatch:"full"}
  ]},
  {path:"**",redirectTo:"home",pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
