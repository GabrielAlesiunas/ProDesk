import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Faz login
  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password: senha })
      .pipe(
        tap(usuario => {
          // Salva usuário no localStorage
          usuario.foto = usuario.foto || 'https://images.unsplash.com/photo-1624261227227-2b6c9a2e3f6b';
          localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
          window.dispatchEvent(new Event('storage')); // para atualizar menus globais
        })
      );
  }

  // Retorna o usuário logado
  getUsuarioLogado(): any {
    const usuario = localStorage.getItem('usuarioLogado');
    return usuario ? JSON.parse(usuario) : null;
  }

  // Faz logout
  logout(): void {
    localStorage.removeItem('usuarioLogado');
    window.dispatchEvent(new Event('storage'));
  }

  // Checa se está logado
  estaLogado(): boolean {
    return !!localStorage.getItem('usuarioLogado');
  }
}
