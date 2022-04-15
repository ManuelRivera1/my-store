import { Component,Output, Input, EventEmitter } from '@angular/core';

import { Product, CreateProductDTO, UpdateProductDTO } from '../../../models/product.model';
import { switchMap } from 'rxjs/operators';

import { StoreService } from '../../../services/store.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  myShoppingCart: Product[] = [];
  total = 0;
  @Input() products: Product[] = [];
  @Input() set productId(id : string | null){
    if(id){
      this.onShowDetail(id);
    }
  }
  @Output() loadMore = new EventEmitter();
  today = new Date();
  showProducts = false;
  productChosen : Product ={
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
    },
    description: ''
  };
  limit = 10;
  offset = 0;
  statusDetails: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }


  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }
  toggleProductDetail(){
    this.showProducts = !this.showProducts;
  }
  onShowDetail(id: string){
    this.statusDetails = 'loading';
    this.productsService.getProduct(id)
    .subscribe(data => {
      if(!this.showProducts){
        this.showProducts = true;
      }
      // this.toggleProductDetail();
      this.productChosen = data;
      this.statusDetails = 'success';
    }, errorMessage => {
      alert(errorMessage);
      this.statusDetails = 'error';
    })
  }
  readAndUpdate(id: string) {
    this.productsService.getProduct(id)
    .pipe(
      switchMap((product) => this.productsService.update(product.id, {title: 'change'})),
    )
    .subscribe(data => {
      console.log(data);
    });
    this.productsService.fetchReadAndUpdate(id, {title: 'change'})
    .subscribe(response => {
      const read = response[0];
      const update = response[1];
    })
  }
  createNewProduct() {
    const product: CreateProductDTO= {
      title: 'Create Product',
      description: 'Create a new product',
      images:[`https://placeimg.com/640/480/any?random=${Math.random()}`],
      price: 100,
      categoryId: 2
    }
    this.productsService.create(product)
    .subscribe(data => {
      this.products.unshift(data)
    });
  }
  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'change title',
    }
    const id = this.productChosen.id;
    this.productsService.update(id, changes)
    .subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products[productIndex] = data;
      this.productChosen = data;
    });
  }
  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.delete(id)
    .subscribe(() => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products.splice(productIndex, 1);
      this.showProducts = false;
    });
  }
  // loadMore() {
  //   this.productsService.getProductsByPage(this.limit,this.offset)
  //   .subscribe(data => {
  //     this.products = this.products.concat(data);
  //     this.offset += this.limit;
  //   });
  // }

  onLoadMore() {
    this.loadMore.emit();
  }
}
