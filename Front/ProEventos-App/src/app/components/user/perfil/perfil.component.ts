import { ValidatiorFields } from '@app/helpers/ValidatiorFields';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserUpdate } from '@app/models/Identity/UserUpdate';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  userUpdate = {} as UserUpdate; //objeto global
  form!: FormGroup;

  constructor(public fb: FormBuilder,
              public accountService: AccountService,
              private router: Router,
              private toaster: ToastrService,
              private spinner: NgxSpinnerService
  ) { }


  ngOnInit() {
    this.validation();
    this.carregarUsuario();
  }

  //esse método vai atraves do AccountService chamar lá na API o meu usuário.
  private carregarUsuario(): void{
    this.spinner.show();
    this.accountService
    .getUser()
    .subscribe(
      (userRetorno: UserUpdate) => {
        console.log(userRetorno);
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toaster.success('Usuário Carregado', 'Sucesso');
      },
      (error) => {
        console.error(error);
        this.toaster.error('Usuário não carregado', 'Erro');
        this.router.navigate(['/dashboard']);
      }
    ).add(() => this.spinner.hide());
  }

  private validation(): void{

    const formOptions: AbstractControlOptions = {
      validators: ValidatiorFields.MustMatch('password', 'confirmarPassword')
    };

    this.form = this.fb.group({
      userName: [''],
      titulo: ['NaoInformado', Validators.required ],
      primeiroNome: ['', Validators.required ],
      ultimoNome:  ['', Validators.required ],
      email: ['',
      [Validators.required, Validators.email]
      ],
      phoneNumber:  ['', Validators.required ],
      funcao:  ['NaoInformado', Validators.required ],
      username:  ['', Validators.required ],
      descricao:  ['', Validators.required ],
      password: ['',
        [Validators.nullValidator, Validators.minLength(6)]
      ],
      confirmarPassword:  ['', Validators.nullValidator ],
    }, formOptions);
  }

  get f():any  { return this.form.controls; }


  onSubmit(): void{
    this.atualizarUsuario();
  }

  public atualizarUsuario(){
    this.userUpdate = {...this.form.value }//atribui o valor do form
    this.spinner.show();

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => this.toaster.success('Usuário atualizado', 'Sucesso'),
      (error) => {
        this.toaster.error(error.error);
        console.error(error);
        console.log("Usuário inválido");
      },
    ).add(() => this.spinner.hide());

  }

  public resetForm(event: any): void{
    event.preventDefault();
    this.form.reset();
  }

}
