import { Component, OnInit } from '@angular/core';
import { authService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-logout-tab',
  templateUrl: './logout-tab.component.html',
  styleUrls: ['./logout-tab.component.css']
})
export class LogoutTabComponent {

  constructor( private authService: authService) { }
  
  logOut()
  {
    this.authService.logout();
  }

}
