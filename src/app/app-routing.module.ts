import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './guard/login-guard/login.guard';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guard/auth-guard/auth.guard';

const routes: Routes = [
  {path:"login", component:LoginComponent,canActivate:[AuthGuard]},
  {path:"home",component:HomeComponent,canActivate:[LoginGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
