import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Supplier } from 'src/app/Models/supplier';
import { ApiService } from 'src/app/service/api.service';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
})
export class SupplierComponent implements OnInit {
  @ViewChild('searchInput', { read: ElementRef, static: true })
  searchInput: ElementRef;

  supps: Array<Supplier> = [];
  suppsLU: Array<Supplier> = [];

  constructor(private api: ApiService, private bsMS: BsModalService) {}

  ngOnInit(): void {
    this.load();
  }
  async load() {
    await this.api
      .supplier({ mode: 'get', data: '' })
      .toPromise()
      .then((res: any) => {
        this.supps = res;
        this.suppsLU = res;
      });
  }
  addSupplier() {
    this.bsMS
      .show(AddSupplierComponent, {
        initialState: {
          data: {
            type: 'create',
            sup: '',
          },
        },
      })
      .content?.response.subscribe((res: any) => {
        if (res.type === 'create') {
          this.supps.push(res.data);
          this.suppsLU.push(res.data);
        }
      });
  }
  showSupplier(s: Supplier) {
    this.bsMS
      .show(AddSupplierComponent, {
        initialState: {
          data: {
            type: 'edit',
            sup: s,
          },
        },
      })
      .content?.response.subscribe((res: any) => {
        if (res.type === 'edit') {
          this.supps.forEach((supp: Supplier) => {
            if (supp.id === res.data.id) {
              supp.name = res.data.name;
              supp.phone = res.data.phone;
            }
          });
        }
      });
  }
  search() {
    this.supps = [];
    let value: string = this.searchInput.nativeElement.value;
    if (value.length <= 0) {
      this.supps = this.suppsLU;
    } else {
      this.suppsLU.forEach((s: Supplier) => {
        if (
          this.api
            .removeAccents(s.name)
            .toLowerCase()
            .indexOf(this.api.removeAccents(value.toLowerCase())) != -1
        ) {
          this.supps.push(s);
        }
      });
    }
  }
}
