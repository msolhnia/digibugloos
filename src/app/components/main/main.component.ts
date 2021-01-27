import { Component, OnDestroy, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute,Router} from '@angular/router';
import { FetchdataService } from 'src/app/Service/fetchdata.service';
import { ProductModel, ProductViewModel, searchModel } from 'src/app/model/appModel';
import { OrderService } from 'src/app/Service/order.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  search: searchModel;  
  sliderProduct: any;
  isAuthenticated = false;
  private userSub: Subscription;
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout:3000,
    center: true,
    dots: true,
    rtl:false,
    // autoHeight: true,
    // autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  }; 

  customOptions2: OwlOptions = {
    loop: false,
    autoplay: false,   
    dots: false,
    nav:true,
    margin:30,
    navText : ['<div class="navi nxt">><div/>','<div class="navi prv"><>><div/>'],
    // autoHeight: true,
    // autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 4,
      },
      1000: {
        items: 4,
      }
    }
  }

  constructor(private route:ActivatedRoute,
    private router:Router,
    public fetchData: FetchdataService,
    private OrderServise:OrderService,
    private authService: AuthService
    ) {
    this.getSliderProducts();
   }

  ngOnInit(): void {

    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy()
  {
    this.userSub.unsubscribe();
  }

  goToCategory(id:number)
  {
    this.router.navigate(["/list",id], { relativeTo: this.route });
  }

  getSliderProducts()
  {
    let sliderSearch=new searchModel();
    sliderSearch.sortBy=1;
    this.fetchData.filterProducts(sliderSearch).subscribe(products => {
      this.sliderProduct=products;            
    });
  }
  
  goToProduct(id:number)
  {
    this.router.navigate(['/detail', id], { relativeTo: this.route });   
  }

  addtoCard(product:ProductViewModel, id:string)
  {
    product.Id=id;    
    this.OrderServise.addToBasket(product);
  }

}
