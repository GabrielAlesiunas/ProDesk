import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private baseUrl = 'http://localhost:3000/api/usuarios'; // seu backend

  constructor(private http: HttpClient) { }

  // Atualiza os dados pessoais
  atualizarDados(usuarioId: number, dados: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${usuarioId}`, dados);
  }

  // Atualiza a foto do perfil
  atualizarFoto(usuarioId: number, foto: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', foto);
    return this.http.put(`${this.baseUrl}/${usuarioId}/foto`, formData);
  }

  // Alterar senha
  alterarSenha(usuarioId: number, senhaAtual: string, novaSenha: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${usuarioId}/senha`, { senhaAtual, novaSenha });
  }

  // Adicionar cartão
  adicionarCartao(usuarioId: number, cartao: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${usuarioId}/cartoes`, cartao);
  }

  // Remover cartão
  removerCartao(usuarioId: number, cartaoId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${usuarioId}/cartoes/${cartaoId}`);
  }
}
