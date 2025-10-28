import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface Avaliacao {
  usuario_id: number;
  espaco_id: number;
  nota: number;
  comentario: string;
}

export interface ReservaHistorico {
  espaco_id: number;
  nome_espaco: string;
  local: string;
  data: string;
  horario: string;
  preco: number;
}

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HttpClientModule, FormsModule],
  templateUrl: './reserva.html',
  styleUrls: ['./reserva.css']
})
export class Reserva implements OnInit {
  usuarioNome: string = '';
  usuarioFoto: string = '';
  usuarioId: number = 0;

  historicoReservas: ReservaHistorico[] = [];
  avaliando: boolean[] = [];
  avaliado: boolean[] = [];
  nota: number[] = [];
  comentario: string[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // Recupera usuário logado
    const usuario = localStorage.getItem('usuarioLogado');
    if (usuario) {
      const dados = JSON.parse(usuario);
      this.usuarioNome = dados.nome;
      this.usuarioFoto = dados.foto;
      this.usuarioId = dados.id; // ID do usuário
    }

    // Exemplo de histórico de reservas (pode substituir com API)
    this.historicoReservas = [
      { espaco_id: 1, nome_espaco: 'Estúdio de Música', local: 'Sala 1', data: '10/10/2025', horario: '16:00 - 18:00', preco: 80 },
      { espaco_id: 2, nome_espaco: 'Auditório', local: 'Sala 3', data: '05/10/2025', horario: '09:00 - 12:00', preco: 150 }
    ];

    // Inicializa arrays de estado
    this.historicoReservas.forEach((_, index) => {
      this.avaliando[index] = false;
      this.avaliado[index] = false;
      this.nota[index] = 0;
      this.comentario[index] = '';
    });
  }

  // Logout
  logout(): void {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }

  // Abrir formulário de avaliação
  abrirFormAvaliacao(index: number) {
    this.avaliando[index] = true;
    this.nota[index] = 0;
    this.comentario[index] = '';
  }

  // Fechar formulário
  fecharFormAvaliacao(index: number) {
    this.avaliando[index] = false;
  }

  // Definir nota
  setNota(index: number, valor: number) {
    this.nota[index] = valor;
  }

  // Enviar avaliação para a API
  enviarAvaliacao(index: number) {
    const reserva = this.historicoReservas[index];
    const avaliacao: Avaliacao = {
      usuario_id: this.usuarioId,
      espaco_id: reserva.espaco_id,
      nota: this.nota[index],
      comentario: this.comentario[index]
    };

    this.http.post('http://localhost:3000/api/avaliacoes', avaliacao).subscribe({
      next: () => {
        alert('Avaliação enviada com sucesso!');
        this.avaliando[index] = false;
        this.avaliado[index] = true;
      },
      error: (err) => {
        console.error('Erro ao enviar avaliação:', err);
        alert('Erro ao enviar avaliação. Tente novamente.');
      }
    });
  }
}
