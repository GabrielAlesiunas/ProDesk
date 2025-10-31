import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReservaService, Reserva as ReservaModel, Avaliacao } from '../../services/reserva'; // usa o tipo do serviço

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

  reservasAtivas: ReservaModel[] = [];
  historicoReservas: ReservaModel[] = [];

  avaliando: boolean[] = [];
  avaliado: boolean[] = [];
  nota: number[] = [];
  comentario: string[] = [];

  constructor(private router: Router, private reservaService: ReservaService) { }

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuarioLogado');
    if (usuario) {
      const dados = JSON.parse(usuario);
      this.usuarioNome = dados.nome;
      this.usuarioFoto = dados.foto;
      this.usuarioId = dados.id;
    }

    if (this.usuarioId) {
      this.carregarReservas();
    }
  }

  carregarReservas() {
    this.reservaService.listarReservasUsuario(this.usuarioId).subscribe({
      next: (reservas) => {
        // separa reservas ativas (confirmadas) e finalizadas
        this.reservasAtivas = reservas.filter(r => r.status === 'confirmada');
        this.historicoReservas = reservas.filter(r => r.status === 'finalizada');

        // inicializa arrays para avaliação
        this.historicoReservas.forEach((_, index) => {
          this.avaliando[index] = false;
          this.avaliado[index] = false;
          this.nota[index] = 0;
          this.comentario[index] = '';
        });
        console.log(reservas)
      },
      error: (err) => {
        console.error('Erro ao carregar reservas:', err);
      }
    });

  }
  logout(): void {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }

  abrirFormAvaliacao(index: number) {
    this.avaliando[index] = true;
    this.nota[index] = 0;
    this.comentario[index] = '';
  }

  fecharFormAvaliacao(index: number) {
    this.avaliando[index] = false;
  }

  setNota(index: number, valor: number) {
    this.nota[index] = valor;
  }

  enviarAvaliacao(index: number) {
    const reserva = this.historicoReservas[index];
    const avaliacao: Avaliacao = {
      usuario_id: this.usuarioId,
      espaco_id: reserva.espaco_id,
      nota: this.nota[index],
      comentario: this.comentario[index]
    };

    this.reservaService.enviarAvaliacao(avaliacao).subscribe({
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
