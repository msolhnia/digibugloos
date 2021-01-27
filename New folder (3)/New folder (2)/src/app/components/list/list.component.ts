import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/auth/auth.service';
import { ProductViewModel, searchModel } from 'src/app/model/appModel';
import { FetchdataService } from 'src/app/Service/fetchdata.service';
import { OrderService } from 'src/app/Service/order.service';
 
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy{
  config: any;
  productList: any;
  cetegoryList: any;
  search: searchModel;
  paramsSubscription:Subscription;
  isAuthenticated = false;
  private userSub: Subscription;
  constructor(public fetchData: FetchdataService, private route: ActivatedRoute, private OrderServise:OrderService,
    private router: Router,private authService: AuthService) 
  {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };

    this.search = new searchModel();    
    
    if(route.firstChild)
    {
      this.paramsSubscription= route.firstChild.params.subscribe(params => {
        let id = +params['id'];
        if(id)
        {
          this.search.cat= Number(id) ; 
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
    this.search.cat = id;
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

  addtoCard(product:ProductViewModel, id:string)
  {
    product.Id=id;    
    this.OrderServise.addToBasket(product);

  }

}

