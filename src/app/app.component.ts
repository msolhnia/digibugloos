import { HttpClient } from '@angular/common/http';
import { OnInit ,Component} from '@angular/core';
import { throwError } from 'rxjs';


export interface PhotosApi {
  albumId?: number;
  id?: number;
  title?: string;
  url?: string;
  thumbnailUrl?: string;
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'digibugloos';
  apiData: PhotosApi;
  limit: number = 10;



  constructor(
    private readonly http: HttpClient,
  ) {}
  ngOnInit() {
    this.fetch(); 
  }


  fetch() {
    const api = `https://jsonplaceholder.typicode.com/albums/1/photos?_start=0&_limit=${this.limit}`;
    const http$ = this.http.get<PhotosApi>(api);

    http$.subscribe(
      res => this.apiData = res,
      err => throwError(err)
    )
  }

}
