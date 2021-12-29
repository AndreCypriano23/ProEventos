import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  form!: FormGroup;

  //toda vez que eu chamar o f ele já vai me chamar os f do form control qq campo que eu quiser
  get f(): any{
    return this.form.controls;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
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

}
