import { Injectable } from '@angular/core';
import { LoginReQuest } from '../Interface/login_request';
import { DataRequest } from '../Interface/data_request';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  server: string = 'http://localhost:3000/';
  constructor(private http: HttpClient) {}

  public login(request: LoginReQuest) {
    return this.http.post(this.server + 'login-authen', request);
  }
  public staff(request: DataRequest) {
    return this.http.post(this.server + 'staff', request);
  }
  public item(request: DataRequest) {
    return this.http.post(this.server + 'item', request);
  }
  public group(request: DataRequest) {
    return this.http.post(this.server + 'group', request);
  }
  public shop(request: DataRequest) {
    return this.http.post(this.server + 'shop', request);
  }
  public policy(request: DataRequest) {
    return this.http.post(this.server + 'policy', request);
  }
}
