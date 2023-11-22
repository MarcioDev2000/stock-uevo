import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   // Verifica se o usuário está autenticado
     if (!this.userService.isLoggin()) {
     // Se não estiver autenticado, navega para a página inicial
     this.router.navigate(['/home']);
     return false;
     }
     // Se estiver autenticado, permite o acesso à rota
       return true;
    }
}
