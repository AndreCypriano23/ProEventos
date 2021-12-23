import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef!: BsModalRef;

  public eventos: Evento[] = [];//eventos está associado agora, e pode ser chamado no bind
  //any = []  significa que ele tem elementos vazio, ele é um array, pode ter length
  public eventosFiltrados: Evento[] = [];

  public larguraImagem: number = 150;
  public margemImagem: number = 2;
  public mostrarImagem: boolean = true;
  private filtroListado: string = '';

  public get filtroLista(): string {
    return this.filtroListado;
  }

  public set filtroLista(value: string) {
    this.filtroListado = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      ( evento: { tema: string; local: string; }) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }


  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
    ) { }


  public ngOnInit(): void {
    //Nós vamos chamar o nosso getEventos dentro do bgOnnit
    //ngOnInit é um método que vai ser chamado antes de iniciar a nossa aplicação, antes do html carregar
    this.spinner.show();
    this.getEventos();

       //setTimeout(() => {
         /** spinner ends after 5 seconds */

       //}, 5000);
  }

  public alterarImagem(): void{
    this.mostrarImagem = !this.mostrarImagem;
    //Toda vez que eu clicar no botão eu vou receber o oposto
  }


  public getEventos(): void{
    //No subscribe nós temos que se inscrever, que é um observable, é como se fosse um callback
    this.eventoService.getEventos().subscribe(
      (_eventos: Evento[]) => {
        this.eventos = _eventos,
        this.eventosFiltrados = this.eventos
      },
      error => {
        this.spinner.hide();
        this.toastr.error('Erro ao Carregar os eventos', 'Erro!');
      },
      () => {
       this.spinner.hide();
      }
    );
  }


  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef.hide();
    this.toastr.success('O Evento foi deletado com sucesso!', 'Deletado');
  }

  decline(): void {
    this.modalRef.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }


}
