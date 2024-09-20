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

  dateTransform(dateTime:string){
    const date = new Date(dateTime);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate} ${formattedTime}`;
  }
  getCurrentDateTime(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  removeAccents(str: string):string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
