import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.scss']
})
export class ToolbarNavigationComponent implements OnInit {

  // adiciona o nome do usuario logado nessa variavel loggedInUserName
  loggedInUserName: string = '';
  isButtonDisabled = false; // desabilitar o botão

  constructor(private cookie: CookieService, private route: Router){}

  ngOnInit(): void {

      // No ngOnInit, você pode recuperar o nome do usuário do cookie
      this.loggedInUserName = this.cookie.get('USER_NAME');
      this.isButtonDisabled = true;
  }

  logoutUser(): void{
    this.cookie.delete('USER_INFO');
    void this.route.navigate(['/home']);
  }



}
