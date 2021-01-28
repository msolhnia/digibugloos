import { Component, OnInit, OnDestroy, ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/Service/auth.service';
import { CategoryModel, ProductViewModel, searchModel } from 'src/app/model/appModel';
import { FetchdataService } from 'src/app/Service/fetchdata.service';
import { OrderService } from 'src/app/Service/order.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, AfterViewChecked,OnDestroy {
  search: searchModel;
  product: any;
  sliderProduct: any;
  isloading=true;
  category: CategoryModel;
  paramsSubscription: Subscription;
  isAuthenticated = false;
  private userSub: Subscription;
  customOptions2: OwlOptions = {
    loop: false,
    autoplay: false,
    dots: false,
    nav: true,
    margin: 30,
    navText: ['<div class="navi nxt">><div/>', '<div class="navi prv"><>><div/>'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 5,
      },
      1000: {
        items: 5,
      }
    }
  }

  constructor(private route: ActivatedRoute, private router: Router, public fetchData: FetchdataService,
    private OrderServise:OrderService,    private authService: AuthService
    ) {
    this.search = new searchModel();
  }

  ngOnInit(): void {
     this.paramsSubscription=this.route.params.subscribe(params => {
      const id = this.route.snapshot.paramMap.get('id');
      this.search.id = id.toString();
      this.getProducts();
    });


    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });


  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.userSub.unsubscribe();
  }

  onCatClick() {
    this.router.navigate(['/list', this.category.Id], { relativeTo: this.route });
  }
  getProducts() {
    this.fetchData.filterProducts(this.search).subscribe(product => {
      this.product = product[0];
      this.getCategory();
      this.getSliderProducts(this.product.cat);
    }
    );
  }

  getCategory() {
    this.fetchData.allCategory.subscribe(Categories => {
      this.category = Categories.filter(cat => cat.Id == this.product.cat)[0];
    }
    );
  }

  getSliderProducts(catId: string) {
    let sliderSearch = new searchModel();
    sliderSearch.cat = Number(catId);
    this.fetchData.filterProducts(sliderSearch).subscribe(products => {      
      this.sliderProduct = products;      
    }
    );
  }

  goToProduct(id: number) {    
    this.router.navigate(['/detail', id], { relativeTo: this.route });
  }

  allproduct()
  {
    this.router.navigate(['/list', -1], { relativeTo: this.route });
  }

  addtoCard(product:ProductViewModel)
  { 
    this.OrderServise.addToBasket(product);
  }



  ngAfterViewChecked()
  {
    this.isloading=false;
  }

}
