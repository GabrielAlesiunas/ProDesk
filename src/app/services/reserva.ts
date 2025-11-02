import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reserva {
  id: number;
  usuario_id: number;
  espaco_id: number;
  espaco_nome: string;
  data_reserva: string;
  hora_inicio: string;
  hora_fim: string;
  preco: number;
  status: 'confirmada' | 'finalizada' | 'cancelada';
}

export interface Avaliacao {
  usuario_id: number;
  espaco_id: number;
  nota: number;
  comentario: string;
}

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  verificarDisponibilidade(espacoId: number, data: string, horaInicio: string, horaFim: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservas/disponibilidade/${espacoId}?data=${data}&hora_inicio=${horaInicio}&hora_fim=${horaFim}`);
  }

  criarReserva(reserva: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservas`, reserva);
  }

  listarReservasUsuario(usuarioId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/reservas/usuario/${usuarioId}`);
  }

  atualizarStatusReserva(id: number, novoStatus: string) {
    return this.http.put(`${this.apiUrl}/reservas/${id}/status`, { status: novoStatus });
  }

  enviarAvaliacao(avaliacao: Avaliacao): Observable<any> {
    return this.http.post(`${this.apiUrl}/avaliacoes`, avaliacao);
  }

  // NOVO: retorna a quantidade de reservas ativas para um espaço em um horário específico
  getOcupacao(espacoId: number, data: string, horaInicio: string, horaFim: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservas/ocupacao/${espacoId}?data=${data}&hora_inicio=${horaInicio}&hora_fim=${horaFim}`);
  }
}
