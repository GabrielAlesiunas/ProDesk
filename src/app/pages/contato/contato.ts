import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './contato.html',
  styleUrls: ['./contato.css']
})
export class Contato implements OnInit {
  usuarioNome: string = '';
  usuarioFoto: string = '';

  constructor(private router: Router) {} // injetando Router

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuarioLogado');
    if (usuario) {
      const dados = JSON.parse(usuario);
      this.usuarioNome = dados.nome;
      this.usuarioFoto = dados.foto;
    }
  }

  // 🔴 Método de logout
  logout(): void {
    localStorage.removeItem('usuarioLogado'); // remove dados do usuário
    this.router.navigate(['/home']); // redireciona para a página de login
  }
}
