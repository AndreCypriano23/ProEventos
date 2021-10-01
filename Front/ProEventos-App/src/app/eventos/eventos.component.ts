import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos: any = [];//eventos está associado agora, e pode ser chamado no bind
  //any = []  significa que ele tem elementos vazio, ele é um array, pode ter length
  public eventosFiltrados: any = [];

  larguraImagem: number = 150;
  margemImagem: number = 2;
  mostrarImagem: boolean = true;
  private _filtroLista: string = '';

  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      ( evento: { tema: string; local: string; }) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  //podemos injetar o httpClient para buscar a API no método construtor
  //Aqui criei uma variável com o nome http que tem o tipo HttpClient
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    //Nós vamos chamar o nosso getEventos dentro do bgOnnit
    //ngOnInit é um método que vai ser chamado antes de iniciar a nossa aplicação, antes do html carregar
    this.getEventos();
  }

  alterarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
    //Toda vez que eu clicar no botão eu vou receber o oposto
  }


  public getEventos(): void{
    //No subscribe nós temos que se inscrever, que é um observable, é como se fosse um callback
    this.http.get('https://localhost:5001/api/eventos').subscribe(
      response => {
        this.eventos = response,
        this.eventosFiltrados = this.eventos
      },
      error => console.log(error)
    );
  }

}
