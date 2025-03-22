import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public username: string = '';
  public password: string = '';

  constructor(private router:Router,private api:ApiService) {}

  ngOnInit(): void {}
  async onSubmit() {
    await this.api.login({username:this.username,password:this.password}).toPromise().then((res:any)=>{
      if(res.success === true && res.role === "admin"){
        localStorage.setItem("login-status","true");
        localStorage.setItem("role","admin");
        this.api.role = "admin";
        this.router.navigate(["/home"]);
      }else if(res.success === true && res.role === "warehouse"){
        localStorage.setItem("login-status","true");
        localStorage.setItem("role","warehouse");
        this.api.role = "warehouse";
        this.router.navigate(["/home/warehouse"]);
      }else{
        alert("Sai thông tin đăng nhập !");
      }
    });
  }
}
