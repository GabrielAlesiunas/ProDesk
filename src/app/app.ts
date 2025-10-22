import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProDesk');
  usuarioNome = '';
  usuarioFoto = 'assets/default-avatar.png';

  ngOnInit() {
    this.atualizarUsuario();
    window.addEventListener('storage', () => this.atualizarUsuario());
  }

  atualizarUsuario() {
    const usuario = localStorage.getItem('usuarioLogado');
    if (usuario) {
      const dados = JSON.parse(usuario);
      this.usuarioNome = dados.nome || '';
      this.usuarioFoto = dados.foto || 'assets/default-avatar.png';
    } else {
      this.usuarioNome = '';
      this.usuarioFoto = 'assets/default-avatar.png';
    }
  }
}
