import { Evento } from './../models/Evento';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { take } from 'rxjs/operators';


@Injectable(
    //Injeção de dependencia, serviço, uma classe no angular
    //Service vem de servir vários componentes por ex, no angular
    //{ providedIn: 'root'}pode injetar usando o root ou se outra forma
)

//Tenho que passar a minha autenticação do Header aqui no Services
export class EventoService {
  baseURL =  environment.apiURL + 'api/eventos';
  //tokenHeader = new HttpHeaders({'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }); COMENTEI PQ ESTOU JÁ USANDO O INTERCEPTOR

  // 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhbmRyZSIsIm5iZiI6MTY0ODIyMDY1OSwiZXhwIjoxNjQ4MzA3MDU5LCJpYXQiOjE2NDgyMjA2NTl9.Zmeg8XWz1qE2A75eX_ofs2cK5HXolkQJ_azRIFDqGfPe1D4SnoM9VqAG-ihylQo5yzkACmgwldlTXd9SQnoCcw' SEM SER DINAMICO
  //`Bearer ${JSON.parse(localStorage.getItem('user')).token}` DINAMICO
  //podemos injetar o httpClient para buscar a API no método construtor
  //Aqui criei uma variável com o nome http que tem o tipo HttpClient
  constructor(private http: HttpClient) { }

  //vou criar um Interceptor, que vai interceptar qq requisição HTTP QUE ESTIVER na aplicação
  //o interceptor vai clonar esse requisição, add ao header
  public getEventos(): Observable<Evento[]>{

      return this.http.get<Evento[]>(this.baseURL).pipe(take(1));
  }

  public getEventosByTema(tema: string): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`).pipe(take(1));
  }

  public getEventoById(id: number): Observable<Evento>{
    return this.http.get<Evento>(`${this.baseURL}/${id}`).pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento>{
    return this.http.post<Evento>(this.baseURL, evento).pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento>{
    return this.http.put<Evento>(`${this.baseURL}/${evento.id}`, evento).pipe(take(1));
  }

  public deleteEvento(id: number): Observable<any>{
    return this.http.delete(`${this.baseURL}/${id}`).pipe(take(1));
  }

  postUpload(eventoId: number, file: File): Observable<Evento>{
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http.post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData);

  }


}
