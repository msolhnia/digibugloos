import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { CategoryModel, ProductModel, searchModel } from '../model/appModel';



@Injectable()
export class FetchdataService {
  
    allProducts: Observable<any> = this.GetDataFromSever("Product"); //get all products from server       
    allCategory: Observable<any> = this.GetDataFromSever("Category"); //get all Categories from server       
    
    constructor(private http: HttpClient) {           
    }

    public refreshProduct() {
        this.allProducts = this.GetDataFromSever("Product");
    }

    public filterProducts(search:searchModel)
    {     
       return this.allProducts.pipe( 
            map(products => {
               return products.filter(d => (search.id == "" || d.id == search.id) && (search.cat == -1 || d.cat == search.cat));           
            })                        
        );                
    } 

    public SaveProduct(title: string, Body: string, imgUrl: string, price: string, cat: string, count: string) {
        let Product: ProductModel = { Title: title, Body: Body, imgUrl: imgUrl, price: price, cat: cat, count: count, Createdate: new Date() };
        this.http.post('http://Product.json',
            Product
        ).subscribe(
            // s => console.log(s)
        );
    }

 

    public saveCategory(id:number,title: string, Description: string) {
        let Category: CategoryModel = { Id: id, Title: title, Description: Description };
        this.http.post('http://Category.json',
            Category
        ).subscribe(
            // s => console.log(s)
        );
    }


    public GetDataFromSever(table:string): Observable<any> {        
        return this.http
            .get('http://'+table)
            .pipe(
                map(responseData => {
                    const postsArray = [];
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                                postsArray.push({ ...responseData[key], id: key });                         
                        }
                    }
                    return postsArray;
                })
            );
    }

}