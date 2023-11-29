import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
private destroy$ = new Subject<void>();
  loginCard = true;


  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required ]]
  })

  signupForm = this.formBuilder.group({

    name: ['', [Validators.required ]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required ]]
  })


  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
     private messageService: MessageService,
     private route: Router){}

  onSubmitLoginForm():void{

   if(this.loginForm.value && this.loginForm.valid){
      this.userService.authUSer(this.loginForm.value as AuthRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
          next:(response)=>{

            if(response){
            this.cookieService.set('USER_INFO', response?.token);// informação do token
            this.cookieService.set('USER_NAME', response?.name);  // nome do usuario
            this.loginForm.reset();
            this.route.navigate(['/dashboard']);

            this.messageService.add({
              severity: 'success',
               summary: 'Sucesso',
               detail: `Seja bem vindo ${response?.name}!`,
               life: 3000
            });

            }
          },
          error:(err) =>{
            this.messageService.add({
              severity: 'error',
               summary: 'Erro',
               detail: `Erro ao fazer o Login `,
               life: 3000
            });
            console.log(err)
          }
      })
   }

  }

  onSubmitSignupForm():void{
   if(this.signupForm.value && this.signupForm.valid){
     this.userService.signupUser(this.signupForm.value as SignupUserRequest)
     .pipe(takeUntil(this.destroy$))
     .subscribe({
       next: (response) =>{
         if(response){
          this.messageService.add({
            severity: 'success',
             summary: 'Sucesso',
             detail: `Usuario criado com suceso`,
             life: 3000
          });
          this.signupForm.reset();
          this.loginCard = true;
         }
       },
       error: (err)=>{
        this.messageService.add({
          severity: 'success',
           summary: 'Sucesso',
           detail: `Erro ao criar Usuario`,
           life: 3000
        });
        console.log(err)
       }
     })
   }

  }

}
