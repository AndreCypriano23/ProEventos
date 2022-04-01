import { ValidatiorFields } from '@app/helpers/ValidatiorFields';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { User } from '@app/models/Identity/User';
import { AccountService } from '@app/services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit {
  /*Register no Back end era o método Registrer na controller Account */

  user = {} as User;//Instância do objeto sem utilizar o New
  form!: FormGroup;

  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toaster: ToastrService) { }

  get f():any  { return this.form.controls; }

  ngOnInit(): void {
    this.validation();
  }

  private validation(): void{

    const formOptions: AbstractControlOptions = {
      validators: ValidatiorFields.MustMatch('password', 'confirmarPassword')
    };

    this.form = this.fb.group({
      primeiroNome: ['', Validators.required ],
      ultimoNome:  ['', Validators.required ],
      email: ['',
      [Validators.required, Validators.email]
      ],
      username:  ['', Validators.required ],
      password: ['',
        [Validators.required, Validators.minLength(4)]
      ],
      confirmarPassword:  ['', Validators.required ],
    }, formOptions);
  }


  //Método de Registrar

  register(): void
  {
    this.user = {...this.form.value};//Spread Operator
    this.accountService.Register(this.user).subscribe(
      () => this.router.navigateByUrl('/dashboard'),
      (error: any) => this.toaster.error(error.error)
    )
  }

}
