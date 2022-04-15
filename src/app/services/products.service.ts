import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError, map } from "rxjs/operators";
import { throwError,zip  } from "rxjs";

import { Product, CreateProductDTO, UpdateProductDTO } from './../models/product.model';
import  { environment } from './../../environments/environment'
import  { checkTime } from './../interceptors/time.interceptor'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private urlApi=`${environment.API_URL}/api/products`;
  private urlApi2=`${environment.API_URL}/api/categories`;
  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.urlApi,{params, context: checkTime() }).pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    );
  }
  getByCategory(categoryId: string,limit?: number, offset?: number){
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(`${this.urlApi2}/${categoryId}/products`,{params})
  }
  getProduct(id: string){
    return this.http.get<Product>(`${this.urlApi}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 500){
          return throwError('UPs algo fallo en el servidor')
        }
        if(error.status === 404){
          return throwError('el producto no existe')
        }
        return throwError('UPs algo fallo')
      })
    );
  }
  getProductsByPage(limit: number, offset: number){
    return this.http.get<Product[]>(`${this.urlApi}`,{
      params: {limit: limit, offset: offset}
    })
  }
  fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    return zip(
      this.getProduct(id),
      this.update(id, dto)
    );
  }
  create(dto: CreateProductDTO){
    return this.http.post<Product>(this.urlApi, dto);
  }
  update(id:string,dto: UpdateProductDTO){
    return this.http.put<Product>(`${this.urlApi}/${id}`, dto)
  }
  delete(id: string){
    return this.http.delete<boolean>(`${this.urlApi}/${id}`);
  }
}
