import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      tipo: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, senha, tipo } = this.loginForm.value;

      // Simula login (você pode depois substituir por backend)
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuario = usuarios.find((u: any) => u.email === email && u.senha === senha && u.tipo === tipo);

      if (usuario) {
        alert(`Login bem-sucedido como ${tipo}!`);
        if (tipo === 'locatorio') {
          this.router.navigate(['/locatorio']);
        } else {
          this.router.navigate(['/anfitriao']);
        }
      } else {
        alert('Usuário ou senha inválidos.');
      }
    }
  }
}
