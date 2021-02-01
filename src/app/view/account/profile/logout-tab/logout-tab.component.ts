import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-logout-tab',
  templateUrl: './logout-tab.component.html',
  styleUrls: ['./logout-tab.component.css']
})
export class LogoutTabComponent implements OnInit {

  constructor( private authService: AuthService) {

   }

  ngOnInit(): void {
  }

  logOut()
  {
    this.authService.logout();
  }

}
