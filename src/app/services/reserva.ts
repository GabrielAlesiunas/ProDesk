import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
