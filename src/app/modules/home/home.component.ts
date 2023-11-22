import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required ]]
  })

  signupForm = this.formBuilder.group({

    name: ['', [Validators.required ]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required ]]
  })


  constructor(private formBuilder: FormBuilder, private userService: UserService, private cookieService: CookieService, private messageService: MessageService){}

  onSubmitLoginForm():void{

   if(this.loginForm.value && this.loginForm.valid){
      this.userService.authUSer(this.loginForm.value as AuthRequest).subscribe({
          next:(response)=>{

            if(response){
            this.cookieService.set('USER_INFO', response?.token);
            this.loginForm.reset();

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
     this.userService.signupUser(this.signupForm.value as SignupUserRequest).subscribe({
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