import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar-espaco',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './cadastrar-espaco.html',
  styleUrls: ['./cadastrar-espaco.css']
})
export class CadastrarEspaco implements OnInit {
  usuarioNome: string = '';
  usuarioFoto: string = '';

  // Injetar o Router no construtor
  constructor(private router: Router) {}

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
    localStorage.removeItem('usuarioLogado'); // remove os dados do usuário
    this.router.navigate(['/login']); // redireciona para a página de login
  }
}
