import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class Avaliacao {
  usuario_id!: number;
  espaco_id!: number;
  nota!: number;
  comentario!: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  private baseUrl = 'http://localhost:3000/api/avaliacoes';

  constructor(private http: HttpClient) {}

  enviarAvaliacao(avaliacao: Avaliacao): Observable<any> {
    return this.http.post(this.baseUrl, avaliacao);
  }

  // Caso queira buscar avaliações de um espaço
  listarAvaliacoesPorEspaco(espaco_id: number): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(`${this.baseUrl}?espaco_id=${espaco_id}`);
  }
}
