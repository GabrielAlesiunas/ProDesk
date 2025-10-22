import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Cartao {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  listar(usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${usuarioId}/cartoes`);
  }

  adicionar(usuarioId: number, cartao: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/${usuarioId}/cartoes`, cartao);
  }

  remover(usuarioId: number, cartaoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${usuarioId}/cartoes/${cartaoId}`);
  }
}
