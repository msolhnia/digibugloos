
import { OnInit ,Component} from '@angular/core';
import { AuthService } from './Service/auth.service';
import { OrderService } from './Service/order.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'digibugloos';

  constructor(private authService: AuthService, private orderService:OrderService) {}

  
  ngOnInit() {    
    this.authService.autoLogin(); 
  } 

}
