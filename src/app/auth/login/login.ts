import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

      this.loginForm.get('email')?.setErrors(null);
      this.loginForm.get('password')?.setErrors(null);

      const usuario = usuarios.find((u: any) => u.email === email);

      if (!usuario) {
        this.loginForm.get('email')?.setErrors({ notFound: true });
        return;
      }

      if (usuario.password !== password) {
        this.loginForm.get('password')?.setErrors({ incorrect: true });
        return;
      }

      this.router.navigate(['/locatorio']);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
