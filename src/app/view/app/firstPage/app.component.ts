
import { OnInit ,Component} from '@angular/core';
import { authService } from '../../../service/auth.service';
import { orderService } from '../../../service/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'digibugloos';

  constructor(private authService: authService, private orderService:orderService) {}
  
  ngOnInit() {    
    this.authService.autoLogin(); 
  } 

}
