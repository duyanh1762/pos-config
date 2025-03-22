import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router ,public api:ApiService) { }

  ngOnInit(): void {
  }
  logout(){
    localStorage.removeItem("login-status");
    localStorage.removeItem("goods-infor");
    localStorage.removeItem("role");
    this.router.navigate(["/login"]);
  }
}
