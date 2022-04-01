import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@app/models/Identity/User';
import { AccountService } from '@app/services/account.service';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
 //O iterceptor é uma classe que Herda de Http Interceptor
  constructor(private accountService: AccountService) {}

  //Ele vai receber uma request, QQ request, aí ele vai pegar ela, clonar(1º parametro),
  //depois a gente retorna O "next:HTPPHandler"
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User;

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
       currentUser =  user

       if(currentUser != null){
        request = request.clone(
          {
            setHeaders: {
              Authorization: `Bearer ${currentUser.token}`
            }
           }
        );
      }

    });

    return next.handle(request);//manda a requisição denovo interceptor, pq
    //já interceptei ela, já clonei ela, então mando denovo
  }
}
