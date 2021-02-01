import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Search } from 'src/app/Model/Search';
import { ProductView } from 'src/app/Interface/ProductView';
import { authService } from 'src/app/service/auth.service';
import { fetchDataService } from 'src/app/service/fetchData.service';
import { orderService } from 'src/app/service/order.service';
import { basketService } from 'src/app/service/basket.service';
 
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy{
  config: any;
  productList: any;
  cetegoryList: any;
  search: Search;
  paramsSubscription:Subscription;
  isAuthenticated = false;
  private userSub: Subscription;
  constructor(public fetchData: fetchDataService, private route: ActivatedRoute, private basketService:basketService,
    private router: Router,private authService: authService) 
  {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };

    this.search = new Search();    
    
    if(route.firstChild)
    {
      this.paramsSubscription= route.firstChild.params.subscribe(params => {
        let id = +params['id'];
        if(id)
        {
          this.search.category= Number(id) ; 
          this.getProducts();                               
        }        
      });
    }
    else
    {
      this.getProducts();          
    }
    this.getCategory() ; 
}

  onProductClick(id: string) {        
    this.router.navigate(['/detail', id], { relativeTo: this.route });    
  }

  pageChange(newPage: number) {
    this.config = {
      currentPage: newPage,
      itemsPerPage: 10
    };
  }


  sortFilter(id: number) {
    this.search.sortBy = id;
    this.getProducts();
  }

  selectCategory(id: number) {
    this.search.category = id;
    this.getProducts();
  } 

  getProducts() {
    
    this.fetchData.filterProducts(this.search).subscribe(products => {
      this.productList=products;
      switch (Number(this.search.sortBy)) {
        case 1:
          this.productList = this.productList.sort(function (a, b) {
            return Number(new Date(b.Createdate)) - Number(new Date(a.Createdate));
          });
          break;
        case 2:
          this.productList = this.productList.sort(function (a, b) {
            return Number(a.price) - Number(b.price);
          });
          break;
        case 3:
          this.productList = this.productList.sort(function (a, b) {
            return Number(b.price) - Number(a.price);
          });
          break;
      }
    }
    );
  }

  getCategory()
  {
    this.fetchData.allCategory.subscribe(Categories => {
      this.cetegoryList=Categories;
    }
    );
  }


  
  ngOnDestroy() {
    if(this.paramsSubscription && !this.paramsSubscription.closed)
    {
      this.paramsSubscription.unsubscribe();
    }  
    this.userSub.unsubscribe();       
  }

  ngOnInit()
  {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  addtoCard(product:ProductView, id:string)
  {
    product.Id=id;    
    this.basketService.addToBasket(product);

  }

}

