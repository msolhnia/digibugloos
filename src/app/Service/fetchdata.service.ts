import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Search } from '../Model/Search';
import { AuthService } from "./auth.service"; 

@Injectable()
export class FetchdataService {
  
    allProducts: Observable<any> = this.getDataFromServer("Product"); //get all products from server       
    allCategory: Observable<any> = this.getDataFromServer("Category"); //get all Categories from server       
    
    constructor(private http: HttpClient,  private authService:AuthService,) {           
    }

    public refreshProduct() {
        this.allProducts = this.getDataFromServer("Product");
    }

    public filterProducts(search:Search)
    {     
       return this.allProducts.pipe( 
            map(products => {
               return products.filter(d => (search.id == "" || d.id == search.id) && (search.category == -1 || d.category == search.category));           
            })                        
        );                
    } 


    public getDataFromServer(table:string): Observable<any> {        
        return this.http
            .get('http://'+table)
            .pipe(
                catchError(this.authService.handleError),
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