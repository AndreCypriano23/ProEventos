import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EventoService } from '@app/services/evento.service';
import { Evento } from '@app/models/Evento';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})


export class EventoDetalheComponent implements OnInit {

  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar = 'post';

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


  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private router: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService
              )
  {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void{
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if(eventoIdParam != null){
      this.spinner.show();

      this.estadoSalvar = 'put';//atualizar

        //eu coloco o + antes para converter de string para int
      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        (evento: Evento) => {
          this.evento = {...evento} //estou pegando cada uma das propriedades do evento que recebi como parametro lá do getById lá da minha API e com esse tres pontos ...eventos eu atribui para dentro do meu evento
          this.form.patchValue(this.evento);//aqui copio o this.evento para cá
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar Evento.', 'Erro!');
          console.error(error);
        },
        () => this.spinner.hide(),
      );

    }
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
      local: [
        '', Validators.required
      ],
      dataEvento: [
         '', Validators.required
      ],
      qtdPessoas: [
        '', [Validators.required, Validators.max(120000)]
      ],
      telefone: [
        '', Validators.required
      ],
      email: [
        '', [Validators.required, Validators.email]
      ],
      imagemURL: [
        '', Validators.required
      ],

    });
  }

  public resetForm(): void{
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any{
    return {'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarAlteracao(): void{
    this.spinner.show();
    if (this.form.valid){
      if(this.estadoSalvar === 'post'){

        this.evento = {...this.form.value}; //o meu evento vai receber tudo que está no formulário
        //e outro detalhe, usando esse ... é como se fosse fazer um automapper aqui

        this.eventoService['post'](this.evento).subscribe(
              () => this.toastr.success('Evento salvo com Sucesso!', 'Sucesso'),
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




}
