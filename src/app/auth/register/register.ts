import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// Validador de CPF
function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const cpf = (control.value || '').replace(/\D/g, '');
  if (!cpf || cpf.length !== 11) return { cpfInvalid: true };
  let sum = 0; let rest;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i-1,i)) * (11-i);
  rest = (sum*10)%11; if(rest==10||rest==11) rest=0;
  if(rest!==parseInt(cpf.substring(9,10))) return { cpfInvalid:true };
  sum=0;
  for(let i=1;i<=10;i++) sum+=parseInt(cpf.substring(i-1,i))*(12-i);
  rest=(sum*10)%11; if(rest==10||rest==11) rest=0;
  if(rest!==parseInt(cpf.substring(10,11))) return { cpfInvalid:true };
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, cpfValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      tipo: ['', Validators.required] // Adicionei tipo de usuário
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, cpf, password, tipo } = this.registerForm.value;

      // Pega os usuários já cadastrados do localStorage
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

      // Verifica se email ou CPF já estão cadastrados
      if (usuarios.find((u: any) => u.email === email)) {
        alert('Email já cadastrado!');
        return;
      }
      if (usuarios.find((u: any) => u.cpf === cpf)) {
        alert('CPF já cadastrado!');
        return;
      }

      // Adiciona o novo usuário
      usuarios.push({ name, email, cpf, password, tipo });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      alert('Cadastro realizado com sucesso!');
      this.router.navigate(['/login']); // Redireciona para login
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
