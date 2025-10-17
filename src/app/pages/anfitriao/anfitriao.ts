import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-anfitriao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './anfitriao.html',
  styleUrls: ['./anfitriao.css']
})
export class Anfitriao {
  espacoForm: FormGroup;
  espacos: { nome: string, descricao: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.espacoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Carregar espaços do localStorage (se houver)
    const saved = localStorage.getItem('espacos');
    if (saved) {
      this.espacos = JSON.parse(saved);
    }
  }

  onSubmit() {
    if (this.espacoForm.valid) {
      const novoEspaco = this.espacoForm.value;
      this.espacos.push(novoEspaco);

      // Salvar no localStorage
      localStorage.setItem('espacos', JSON.stringify(this.espacos));

      alert('Espaço cadastrado com sucesso!');
      this.espacoForm.reset();
    } else {
      this.espacoForm.markAllAsTouched();
    }
  }
}
