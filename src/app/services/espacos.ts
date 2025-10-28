import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Espacos {
  private apiUrl = 'http://localhost:3000/api/espacos';

  constructor(private http: HttpClient) {}

  // Listar espaços
  getEspacos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Cadastrar espaço (FormData suporta arquivos)
  cadastrarEspaco(dados: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, dados);
  }

  // Buscar avaliações de um espaço
  getAvaliacoes(id: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/avaliacoes/${id}`);
  }
}
