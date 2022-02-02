import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Toast, ToastrService } from 'ngx-toastr';

import { EventoService } from '@app/services/evento.service';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { LoteService } from '@app/services/lote.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '@environments/environment';




@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})


export class EventoDetalheComponent implements OnInit {

  modalRef: BsModalRef;
  eventoId: number;
  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar = 'post';
  loteAtual = {id:0, nome: '', indice: 0}
  imagemURL = 'assets/upload-cloud.png';
  file: File;

get modoEditar(): boolean{
  //Se tiver no modo editar aparece, se for no 'novo' aí não
  //tipo vc vai adicionar um evento para um lote que já existe
  return this.estadoSalvar == 'put';
}


  //propriedade f
  //toda vez que eu chamar o f ele já vai me chamar os f do form control qq campo que eu quiser
  get f(): any{
    return this.form.controls;
  }

  //outra propriedade
  get bsConfig(): any{
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  //date para lotes
  get bsConfigLote(): any{
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }


  //get para adicionar mais lotes
  get lotes(): FormArray{
    return this.form.get('lotes') as FormArray;
  }

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private activatedRouter: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private router: Router,
              private loteService: LoteService,
              private modalService: BsModalService
              )
  {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void{
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if(this.eventoId != null && this.eventoId != 0){
      this.spinner.show();

      this.estadoSalvar = 'put';//atualizar

        //eu coloco o + antes para converter de string para int
      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento: Evento) => {
          this.evento = {...evento} //estou pegando cada uma das propriedades do evento que recebi como parametro lá do getById lá da minha API e com esse tres pontos ...eventos eu atribui para dentro do meu evento
          this.form.patchValue(this.evento);//aqui copio o this.evento para cá
          if(this.evento.imagemURL != ''){
            this.imagemURL = environment.apiURL + 'resources/images/' + this.evento.imagemURL;

          }
          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criarlote(lote));
          });
          //this.carregarLotes();
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar carregar Evento.', 'Erro!');
          console.error(error);
        }
      ).add(() => this.spinner.hide());

    }
  }

  //essa seria a maneira mais robusta de fazer e lá no carregar evento instancia o this.carregarLotes()
  //essa forma mais complexa exige mais uma consulta ao banco eu não comentei esse método para estudo mas nao vou usar ele
  public carregarLotes(): void{
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno: Lote[]) => {
        lotesRetorno.forEach(lote => {//cada um dos itens do retorno serão passados aqui para o 'lote' via callback e aí eu dou um push para cada passando os seus próprios formulários
          this.lotes.push(this.criarlote(lote));
        });
      },
      (error: any) => {
        this.toastr.error('Erro ao tentar carregar os Lotes', 'Erro');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }



  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void{
    this.form = this.fb.group({
      //cada um dos campos que tenho no model

      tema: [
        '', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]
      ],
      local: [ '', Validators.required ],
      dataEvento: [ '', Validators.required ],
      qtdPessoas: [ '', [Validators.required, Validators.max(120000)] ],
      telefone: [ '', Validators.required ],
      email: [
        '', [Validators.required, Validators.email]
      ],
      imagemURL: [ '' ],
      lotes: this.fb.array([])
    });
  }

  adicionarLote(): void{
    this.lotes.push(this.criarlote({id: 0} as Lote));//ele vai dar um push dentro de lotes para cada novo form de lotes que eu for inserir
  }

  criarlote(lote: Lote): FormGroup{
    return this.fb.group({
      id: [lote.id],
      nome: [ lote.nome , Validators.required],
      preco: [ lote.preco, Validators.required],
      dataInicio: [ lote.dataInicio ],
      dataFim: [ lote.dataFim ],
      quantidade: [ lote.quantidade, Validators.required],
    });
  }

  public retornaTituloLote(nome: string): string{

    return nome === null ||  nome === '' ? 'Nome do lote' : nome;

  }


  public resetForm(): void{
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  public salvarEvento(): void{
    this.spinner.show();
    if (this.form.valid){
      if(this.estadoSalvar === 'post'){

        this.evento = {...this.form.value}; //o meu evento vai receber tudo que está no formulário
        //e outro detalhe, usando esse ... é como se fosse fazer um automapper aqui

        this.eventoService[this.estadoSalvar](this.evento).subscribe(
              (eventoRetorno: Evento) => {//aqui recebemos um evento que acabou de ser criado
                this.toastr.success('Evento salvo com Sucesso!', 'Sucesso');
                //Aqui em baixo eu vou chamar a página novamente para aparecer o lote
                this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
              },
              (error: any) => {
                console.error(error);
                this.spinner.hide();
                this.toastr.error('Erro ao salvar o evento', 'Error');
              },
              () => this.spinner.hide()
         );

      } else {
        this.evento = {id: this.evento.id, ...this.form.value};//depois que add o id aí sim add todos os outros

        this.eventoService['put'](this.evento).subscribe(
          () => this.toastr.success('Evento atualizado com Sucesso!', 'Sucesso'),
          (error: any) => {
            console.error(error);
            this.spinner.hide();
            this.toastr.error('Erro ao salvar o evento', 'Error');
          },
          () => this.spinner.hide()
        );

      }
    }

  }

  public salvarLotes(): void {
    this.spinner.show();
    if(this.form.controls.lotes.valid){

      this.loteService.saveLote(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success('Lotes Salvos com Sucesso!', 'Sucesso!');
            //this.lotes.reset();
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar salvar lotes.', 'Erro');
            console.error(error);
          }
        ).add(() => this.spinner.hide());

    }
  }

  public removerLote(template: TemplateRef<any>,
    indice: number): void {

    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm' });
}


  confirmDeleteLote(): void{
    this.modalRef.hide();
    this.spinner.show();
    this.loteService.deleteLote(this.eventoId, this.loteAtual.id)
    .subscribe(
      () => {
        this.toastr.success('Lote deletado com sucesso', 'Sucesso');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o lote ${this.loteAtual.id}`);
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  declineDeleteLote(): void{
    this.modalRef.hide();
  }

  onFileChange(ev: any): void{
    const reader = new FileReader();
    //mudando a imagem que aparece na tela
    reader.onload = (event: any) => this.imagemURL = event.target.result;

    //mudando o arquivo
    this.file = ev.target.files;//vou inserir aqui todos os meus arquivos do input html

    reader.readAsDataURL(this.file[0]);//posição 0 pq estou enviando apenas uma img
    //veja que eu peguei os metodos do objeto FileReader e sobrescrevi-los para poder alterar a foto

    this.uploadImagem();
  }

  uploadImagem(): void{
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      () => {
        this.carregarEvento();//vou carregar o evento pq eu acabei de alterar o evento, lá no back vc altera o nome do campo ImageURL
        this.toastr.success('Imagem atualizada com Sucesso', 'Sucesso!');
      },
      (error: any) => {
        this.toastr.error('Erro ao fazer o upload de imagem', 'Erro!');
        console.log(error);
      }
    ).add(() => this.spinner.hide());
  }

}
