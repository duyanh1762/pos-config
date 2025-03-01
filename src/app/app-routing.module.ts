import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './guard/login-guard/login.guard';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guard/auth-guard/auth.guard';
import { ShopsComponent } from './shops/shops.component';
import { ItemsComponent } from './items/items.component';
import { GroupsComponent } from './groups/groups.component';
import { PolicysComponent } from './policys/policys.component';
import { ShopDetailsComponent } from './shops/shop-details/shop-details.component';
import { ShopListComponent } from './shops/shop-list/shop-list.component';

const routes: Routes = [
  {path:"login", component:LoginComponent,canActivate:[AuthGuard]},
  {path:"home",component:HomeComponent,canActivate:[LoginGuard],children:[
    {path:"shops",component:ShopsComponent,canActivate:[LoginGuard],children:[
      {path:"",component:ShopListComponent,canActivate:[LoginGuard]},
      {path:"details",component:ShopDetailsComponent,canActivate:[LoginGuard]}
    ]},
    {path:"items",component:ItemsComponent,canActivate:[LoginGuard]},
    {path:"groups",component:GroupsComponent,canActivate:[LoginGuard]},
    {path:"policys",component:PolicysComponent,canActivate:[LoginGuard]},
    {path:"warehouse",loadChildren:() =>
      import('./warehouse/warehouse.module').then((m) => m.WarehouseModule),},
    {path:"",redirectTo:"shops",pathMatch:"full"}
  ]},
  {path:"**",redirectTo:"home",pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
