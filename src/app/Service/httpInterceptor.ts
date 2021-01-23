import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class httpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  {
    const url = 'https://digibugloos-default-rtdb.europe-west1.firebasedatabase.app/';

    if (req.url.indexOf('http://') === -1) {
      return next.handle(req);
    }
    else
    {
      req = req.clone({url: req.url.replace("http://",url)+'.json'});
    }
     console.log(req.url);
    
    return next.handle(req);
  }
}