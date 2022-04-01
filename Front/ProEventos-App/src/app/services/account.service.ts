import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/models/Identity/User';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '@environments/environment';
import { map, take } from "rxjs/operators";
import { UserUpdate } from '@app/models/Identity/UserUpdate';


  //Service para me proporcionar o que   eu preciso lá na tela de login
  //Nome eu deixei Account pq lá no Back eu fiz a controller com esse nome

@Injectable(/*{ providedIn: 'root'}*/)

export class AccountService {
  private currentUserSource = new ReplaySubject<User>(1);//Ele vai ter buffer de (1)

  //Variável que vai receber diversas atualizações, ex, se editar o perfil, e mudar o token, todas as partes do sistema tem que receber esse token alterado
  public currentUser$ = this.currentUserSource.asObservable(); //variável que é um observable. A posição da memória dessa variável esta apontando para currentUserSource
  //entao todas as vezes que o currentUserSource ocorrer alteração, essa variável tbm alterará
  //veja que essa variável é public, ela pode ser acessada por outros lugares

  baseUrl = environment.apiURL + 'api/account/'//Esse api/account é a controller do back
  constructor(private http: HttpClient) { }

  public Login(model: any): Observable<void> {
    //Vou fazer um mapping aqui
    return this.http.post<User>(this.baseUrl + 'login', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if(user){
          //localStorage.setItem('user', JSON.stringify(user));
          //Vou transformar meu objeto JSON que foi retornado em string e salvo dentro do localStorage que vai ter o user lá
          //Só que assim é chato, toda hora ter que ficar checando no localStorage
          //Então vou fazer de outra forma
          this.setCurrentUser(user);
        }
      })
    );
  }

  getUser(): Observable<UserUpdate>{
    return this.http.get<UserUpdate>(this.baseUrl + 'getUser').pipe(take(1));
    //Esse 'getUser' é o método do .NET Já implementado
  }

  updateUser(model: UserUpdate): Observable<void>{
    return this.http.put<UserUpdate>(this.baseUrl + 'updateUser', model).pipe(
      take(1),
      map((user: UserUpdate) =>{
        this.setCurrentUser(user);
      }
      )//map:o retorno que eu tiver aqui, eu espero que seja do tipo UserUpdate
    )
  }

  public Register(model: any): Observable<void> {
    return this.http.post<User>(this.baseUrl + 'register', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user);
        }
      })
    );
  }

  public logout(): void{
    localStorage.removeItem('user');
    this.currentUserSource.next(null);//vai deslogar todo mundo, ficar null
    this.currentUserSource.complete();
  }

  public setCurrentUser(user: User): void{
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }


}
