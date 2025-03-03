import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Goods } from 'src/app/Models/goods';
import { ApiService } from 'src/app/service/api.service';
import { GoodsEditComponent } from './goods-edit/goods-edit.component';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css'],
})
export class GoodsComponent implements OnInit {
  @ViewChild('searchInput', { read: ElementRef, static: true })
  searchInput: ElementRef;

  goods: Array<Goods> = [];
  goodsLU: Array<Goods> = [];

  constructor(private api: ApiService, private bsMS: BsModalService) {}

  ngOnInit(): void {
    this.load();
  }

  async load() {
    await this.api
      .goods({ mode: 'get', data: '' })
      .toPromise()
      .then((res: any) => {
        this.goods = res;
        this.goodsLU = res;
      });
  }
  addGoods() {
    this.bsMS
      .show(GoodsEditComponent, {
        initialState: {
          data: {
            type: 'create',
            data: '',
          },
        },
      })
      .content?.response.subscribe((res: any) => {
        console.log(res);
        if (res.type === 'create') {
          console.log(res);
          this.goodsLU.push(res.data);
          this.goods = this.goodsLU;
        }
      });
  }
  showItem(g: Goods) {
    this.bsMS
      .show(GoodsEditComponent, {
        initialState: {
          data: {
            type: 'edit',
            data: g,
          },
        },
      })
      .content?.response.subscribe((res: any) => {
        if (res.type === 'edit') {
          this.goodsLU.forEach((g: Goods) => {
            if (g.id === res.data.id) {
              g.name = res.data.name;
              g.price = res.data.price;
              g.groupID = res.data.groupID;
              g.unit = res.data.unit;
            }
          });
          this.goods = this.goodsLU;
        }
      });
  }
  search() {
    this.goods = [];
    let value: string = this.searchInput.nativeElement.value;
    if (value.length <= 0) {
      this.goods = this.goodsLU;
    } else {
      this.goodsLU.forEach((s: Goods) => {
        if (
          this.api
            .removeAccents(s.name)
            .toLowerCase()
            .indexOf(this.api.removeAccents(value.toLowerCase())) != -1
        ) {
          this.goods.push(s);
        }
      });
    }
  }
}
