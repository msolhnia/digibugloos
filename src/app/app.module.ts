import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './view/app/firstPage/app.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './routing/app-routing.module'; 
import { HeaderComponent } from './view/app/header/header.component';
import { MainComponent } from './view/app/firstPage/main/main.component';
import { ListComponent } from './view/app/product/productList/list.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';

import { NgxPaginationModule } from 'ngx-pagination';
import { FetchdataService } from 'src/app/service/fetchData.service';
import { httpInterceptor } from './interceptor/httpInterceptor';
import { OrderService } from './service/order.service';
import { BascketComponent } from './view/account/basket/bascket.component';
import { OrderComponent } from './view/account/order/order.component';
import { ProfileComponent } from './view/account/profile/profile.component';
import { AuthComponent } from './view/account/register/auth.component';
import { AuthInterceptorService } from './interceptor/authInterceptor'; 
import { AuthService} from './service/auth.service';
import { UserTabComponent } from './view/account/profile/user-tab/user-tab.component';
import { OrdersTabComponent } from './view/account/profile/orders-tab/orders-tab.component';
import { LogoutTabComponent } from './view/account/profile/logout-tab/logout-tab.component';
import { DialogComponent } from './view/account/profile/orders-tab/orderDetails/dialog.component';
import { LoaderComponent } from './view/shared/loader/loader.component'
import { DetailComponent } from './view/app/product/productDetail/detail.component';

@NgModule({
  declarations: [
    
    AppComponent,
    HeaderComponent,
    MainComponent,
    DetailComponent,
    ListComponent,
    BascketComponent,
    OrderComponent,
    ProfileComponent,
    AuthComponent,
    UserTabComponent,
    OrdersTabComponent,
    LogoutTabComponent,
    DialogComponent,
    LoaderComponent,
  ],
  imports: [
    FormsModule,ReactiveFormsModule,
    NgxPaginationModule,
    AppRoutingModule,
    HttpClientModule, 
    CarouselModule,  
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,    
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatIconModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [FetchdataService,OrderService, AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: httpInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS,useClass: AuthInterceptorService,multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
