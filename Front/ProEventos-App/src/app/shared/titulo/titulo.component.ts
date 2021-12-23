import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})
export class TituloComponent implements OnInit {
  @Input() titulo!: string;
  @Input() iconClass = 'fa fa-user';
  @Input() subtitulo = 'Desde 2021';
  @Input() botaoListar = false;

               //Injetando rotas
  constructor(private router: Router) { }

    ngOnInit(): void {  }

    /* método list*/
    lista(): void {

      /*Função para deixar dinamico o nome do titulo */
      this.router.navigate([`/${this.titulo.toLocaleLowerCase()}/lista`]);

    }


}


