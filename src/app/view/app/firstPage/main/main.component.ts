import { Component, OnDestroy, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute,Router} from '@angular/router';
import { fetchDataService } from 'src/app/service/fetchData.service';
import { authService } from 'src/app/service/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Search } from 'src/app/Model/Search';
import { ProductView } from 'src/app/Interface/ProductView';
import { basketService } from 'src/app/service/basket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  search: Search;  
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
    public fetchData: fetchDataService,
    private basketService: basketService,
    private authService: authService
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
    let sliderSearch=new Search();
    sliderSearch.sortBy=1;
    this.fetchData.filterProducts(sliderSearch).subscribe(products => {
      this.sliderProduct=products;            
    });
  }
  
  goToProduct(id:number)
  {
    this.router.navigate(['/detail', id], { relativeTo: this.route });   
  }

  addtoCard(product:ProductView, id:string)
  {
    product.Id=id;    
    this.basketService.addToBasket(product);
  }

}
