import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  login(email: string, senha: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password: senha })
      .pipe(
        tap(usuario => {
          // Salva usuário no localStorage
          usuario.foto = usuario.foto || 'https://images.unsplash.com/photo-1624261227227-2b6c9a2e3f6b';
          localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        })
      );
  }
}
