import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// Tipos esperados (ajuste conforme seu backend)
interface Indicators { totalReservas: number; reservasAtivas: number; faturamentoTotal: number; avaliacaoMedia: number; totalClientes: number; }
interface ChartData { labels: string[]; values: number[]; }

@Injectable({
  providedIn: 'root'
})
export class Dashboard {
  private base = '/api/dashboard'; // ajuste para sua base

  constructor(private http: HttpClient) {}

  getIndicators(): Observable<Indicators> {
    // substitua com sua rota real, ex: return this.http.get<Indicators>(`${this.base}/indicadores`);
    return this.http.get<Indicators>(`${this.base}/indicadores`);
  }

  getReservasPorMes(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.base}/reservas-por-mes`);
  }

  getTiposEspacoMaisReservados(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.base}/tipos-mais-reservados`);
  }

  getFaturamentoMensal(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.base}/faturamento-mensal`);
  }
}
