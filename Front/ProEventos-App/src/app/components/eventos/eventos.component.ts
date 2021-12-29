import { Component, OnInit } from '@angular/core';

import { Evento } from '@app/models/Evento';//usando atalho @app ao inves de ../../
import { EventoService } from '../../services/evento.service';//sem atalho

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
  //providers: [EventoService] Injeta dependencia root do service 2 forma

})
export class EventosComponent implements OnInit {
  ngOnInit(): void {

  }
}
