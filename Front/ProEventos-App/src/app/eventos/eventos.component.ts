import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos: any;

  //podemos injetar o httpClient para buscar a API no método construtor
  //Aqui criei uma variável com o nome http que tem o tipo HttpClient
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    //Nós vamos chamar o nosso getEventos dentro do bgOnnit
    //ngOnInit é um método que vai ser chamado antes de iniciar a nossa aplicação, antes do html carregar
    this.getEventos();

  }


  public getEventos(): void{
    //No subscribe nós temos que se inscrever, que é um observable, é como se fosse um callback
    this.http.get('https://localhost:5001/api/eventos').subscribe(
      response => this.eventos = response,
      error => console.log(error)
    );
  }

}
