import { Evento } from './../models/Evento';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable(
    //Injeção de dependencia, serviço, uma classe no angular
    //Service vem de servir vários componentes por ex, no angular
    //{ providedIn: 'root'}pode injetar usando o root ou se outra forma
)
export class EventoService {
  baseURL = 'https://localhost:5001/api/eventos';

  //podemos injetar o httpClient para buscar a API no método construtor
  //Aqui criei uma variável com o nome http que tem o tipo HttpClient
  constructor(private http: HttpClient) { }

  public getEventos(): Observable<Evento[]>{
      return this.http.get<Evento[]>(this.baseURL);
  }

  public getEventosByTema(tema: string): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`);
  }

  public getEventoById(id: number): Observable<Evento>{
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  public post(evento: Evento): Observable<Evento>{
    return this.http.post<Evento>(this.baseURL, evento);
  }

  public put(evento: Evento): Observable<Evento>{
    return this.http.put<Evento>(`${this.baseURL}/${evento.id}`, evento);
  }

  public deleteEvento(id: number): Observable<any>{
    return this.http.delete(`${this.baseURL}/${id}`);
  }

}
