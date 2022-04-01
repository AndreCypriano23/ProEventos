import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashborad.component';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';

import { EventoDetalheComponent } from './components/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from './components/eventos/evento-lista/evento-lista.component';
import { EventosComponent } from './components/eventos/eventos.component';

import { UserComponent } from './components/user/user.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { LoginComponent } from './components/user/login/login.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';

import { ContatosComponent } from './components/contatos/contatos.component';

import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },/*Quando nao for nada, tipo index eu quero isso */
  //home vai ser um lucar onde QQ usuário vai poder acessar, se inscrever

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
     {
        path: 'user', redirectTo: 'user/perfil'
     },
     {
        path: 'user/perfil', component: PerfilComponent
     },
     {
        path: 'eventos', redirectTo: 'eventos/lista' },
     {
       path: 'eventos', component: EventosComponent,
       children: [
         { path: 'detalhe/:id', component: EventoDetalheComponent },
         { path: 'detalhe', component: EventoDetalheComponent },
         { path: 'lista', component: EventoListaComponent },
       ]
     },
     { path: 'dashboard', component: DashboardComponent },
     { path: 'palestrantes', component: PalestrantesComponent },
     { path: 'contatos', component: ContatosComponent },

    ]
    //Estou criando um agrupamento, onde todos os filhos dessa configuração devem ser autenticados
  },

 {
    path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent},
      { path: 'registration', component: RegistrationComponent},//Esses dois nao será autenticado, qq um poderá usar essa tela
    ]
  },

  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent},
      { path: 'registration', component: RegistrationComponent},//Esses dois nao será autenticado, qq um poderá usar essa tela
    ]
  },
  { path: 'home', component: HomeComponent },//O home nao será autenticado, os outros 3 sim
  { path: '**', redirectTo: 'home', pathMatch: 'full' }/*se nao for qq outra coisa de antes */
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
