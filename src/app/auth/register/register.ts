import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  registerForm: FormGroup;
  showPassword: boolean = false;
  showConfirm: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+com$/)]],
        cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)]],
        password: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {

    if (this.registerForm.valid) {
      const { name, email, cpf, password, tipo } = this.registerForm.value;

      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

      const usuarioExistente = usuarios.find(
        (u: any) => u.email === email || u.cpf === cpf
      );

      if (usuarioExistente) {
        alert('Usuário já cadastrado com este e-mail ou CPF.');
        return;
      }

      usuarios.push({ name, email, cpf, password, tipo });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      alert('Cadastro realizado com sucesso!');
      this.router.navigate(['/login']);
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
      this.registerForm.markAllAsTouched();
    }
  }
}
