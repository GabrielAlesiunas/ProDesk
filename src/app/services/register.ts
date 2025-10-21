import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Register {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  cadastrar(name: string, email: string, cpf: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { name, email, cpf, password });
  }
}
