import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lote } from '@app/models/Lote';
import { Observable } from 'rxjs';

@Injectable()
export class LoteService {

  baseURL = 'https://localhost:5001/api/lotes';

  constructor(private http: HttpClient) { }

  public getLotesByEventoId(eventoId: number): Observable<Lote[]>{
      return this.http.get<Lote[]>(`${this.baseURL}/${eventoId}`);
  }

  public saveLote(eventoId: number, lotes: Lote[]): Observable<Lote[]>{
    return this.http.put<Lote[]>(`${this.baseURL}/${eventoId}`, lotes);
  }

  public deleteLote(eventoId: number, loteId: number): Observable<any>{
    return this.http.delete(`${this.baseURL}/${eventoId}/${loteId}`);
  }


}
