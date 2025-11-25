import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from './../../services/auth';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';

  // 🔒 controle do modal
  modalAberto: boolean = false;
  emailRecuperacao: string = '';
  novaSenha: string = '';

  modalFeedbackAberto: boolean = false;
  feedbackTitulo: string = '';
  feedbackMensagem: string = '';

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
        this.router.navigate(['/locatorio']);
      },
      error: (err) => {
        const error = err.error.error || 'Erro no login.';
        if (error === 'Usuário não encontrado.') {
          this.loginForm.get('email')?.setErrors({ notFound: true });
          alert('Email não encontrado.'); // ⚠️ Alerta do navegador
        } else if (error === 'Senha incorreta.') {
          this.loginForm.get('password')?.setErrors({ incorrect: true });
          alert('Senha incorreta.'); // ⚠️ Alerta do navegador
        } else {
          this.errorMessage = error;
          alert(error); // ⚠️ Alerta genérico
        }
      }
    });
  } else {
    this.loginForm.markAllAsTouched();
  }
}

  // === 🔒 modal de redefinição ===
  abrirModalSenha() {
    this.modalAberto = true;
    this.emailRecuperacao = '';
    this.novaSenha = '';
  }

  fecharModalSenha() {
    this.modalAberto = false;
  }

  redefinirSenha() {
    // Exemplo de requisição ao backend
    this.auth.redefinirSenha(this.emailRecuperacao, this.novaSenha).subscribe({
      next: () => {
        this.modalAberto = false;
        this.feedbackTitulo = 'Sucesso!';
        this.feedbackMensagem = 'Sua senha foi alterada com sucesso.';
        this.modalFeedbackAberto = true;
      },
      error: (err) => {
        this.modalAberto = false;
        this.feedbackTitulo = 'Erro';
        this.feedbackMensagem = err.error?.message || 'Não foi possível alterar a senha.';
        this.modalFeedbackAberto = true;
      }
    });
  }

  // Fechar modal de feedback
  fecharModalFeedback() {
    this.modalFeedbackAberto = false;
  }
}
