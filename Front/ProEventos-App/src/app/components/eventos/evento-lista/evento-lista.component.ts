import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';//usando com @, configurado no tsconfig, fica bem melhor
import { EventoService } from 'src/app/services/evento.service';// sem usar o @app tendo que escrever todo o caminho
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { environment } from '@environments/environment';

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
  public eventoId = 0;

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
    this.carregarEventos();

       //setTimeout(() => {
         /** spinner ends after 5 seconds */

       //}, 5000);
  }

  public alterarImagem(): void{
    this.mostrarImagem = !this.mostrarImagem;
    //Toda vez que eu clicar no botão eu vou receber o oposto
  }


  public carregarEventos(): void{
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

//quando clica em deletar abre o modal com a mensagem
  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        if(result.message === 'Deletado'){
          console.log(result);
          this.toastr.success('O Evento foi deletado com sucesso!', 'Deletado');
          this.spinner.hide();
          this.carregarEventos();//carregando novamente os eventos.
        }
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`, 'Erro');
        this.spinner.hide();
        console.error(error);
      },
      () => this.spinner.hide(),
    );

  }

  decline(): void {
    this.modalRef.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  public mostraImagem(imagemURL: string): string{
    return (imagemURL != '')
    ? `${environment.apiURL}resources/images/${imagemURL}`
    : 'assets/sem-imagem.png';
  }


}
