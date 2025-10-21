import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from './../../services/auth';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.auth.login(email, password).subscribe({
        next: (res) => {
          console.log('Login bem-sucedido:', res);
          this.router.navigate(['/locatorio']); // redireciona após login
        },
        error: (err) => {
          console.error(err);
          const error = err.error.error || 'Erro no login.';

          // Define erros específicos nos campos do formulário
          if (error === 'Usuário não encontrado.') {
            this.loginForm.get('email')?.setErrors({ notFound: true });
          } else if (error === 'Senha incorreta.') {
            this.loginForm.get('password')?.setErrors({ incorrect: true });
          } else {
            this.errorMessage = error;
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
