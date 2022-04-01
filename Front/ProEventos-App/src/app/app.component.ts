import { Component } from '@angular/core';
import { User } from './models/Identity/User';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //title = 'ProEventos-App';
  //Aqui vou arrumar o bug de usuário corrente quando atualizo
  constructor(public accountService: AccountService){}

  ngOnInit(): void{
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    //vai chamar meu account service current

    let user: User;
    if(localStorage.getItem('user')){
      user = JSON.parse(localStorage.getItem('user') ?? '{}'); //Se ele foi fazio atribuo {}`pra ele só
    }else{
      user = null;
    }

    if(user){
      this.accountService.setCurrentUser(user);
    }

  }

}
