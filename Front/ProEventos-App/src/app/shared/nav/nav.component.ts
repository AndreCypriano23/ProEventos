import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isCollapsed = true;

  constructor(public accountService: AccountService,
              private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void
  {
    //isso vai ajudar a toda hora nao ter que ficar limpando o local storage
    this.accountService.logout();
    this.router.navigateByUrl('/user/login');
  }

  showMenu(): boolean{
    return this.router.url !== '/user/login';
  }

}
