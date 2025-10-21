import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Espacos {
  private apiUrl = 'http://localhost:3000/api/espacos';

  constructor(private http: HttpClient) {}

  getEspacos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAvaliacoes(espacoId: number) {
  return this.http.get<any[]>(`http://localhost:3000/api/avaliacoes/${espacoId}`);
}
}
