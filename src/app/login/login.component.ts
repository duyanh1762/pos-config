import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public username: string = '';
  public password: string = '';

  constructor(private router:Router) {}

  ngOnInit(): void {}
  onSubmit() {
    if(this.username === "admin" && this.password ==="admin"){
      localStorage.setItem("login-status","true");
      this.router.navigate(["/home"]);
    }else{
      alert("Sai thông tin đăng nhập !");
    }
  }
}
