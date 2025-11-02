import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReservaService, Reserva as ReservaModel, Avaliacao } from '../../services/reserva';

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

  // === controle do modal ===
  modalAberto: boolean = false;
  modalAcao: 'finalizar' | 'cancelar' | null = null;
  reservaSelecionada: ReservaModel | null = null;

  // === modal de sucesso ===
  modalSucessoAberto: boolean = false;
  mensagemModal: string = '';

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
        this.reservasAtivas = reservas.filter(r => r.status === 'confirmada');
        this.historicoReservas = reservas.filter(r => r.status === 'finalizada' || r.status === 'cancelada');

        this.historicoReservas.forEach((_, index) => {
          this.avaliando[index] = false;
          this.avaliado[index] = false;
          this.nota[index] = 0;
          this.comentario[index] = '';
        });
        console.log(reservas);
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

  // === abertura e fechamento do modal ===
  abrirModal(reserva: ReservaModel, acao: 'finalizar' | 'cancelar') {
    this.modalAberto = true;
    this.modalAcao = acao;
    this.reservaSelecionada = reserva;
  }

  fecharModal() {
    this.modalAberto = false;
    this.modalAcao = null;
    this.reservaSelecionada = null;
  }

  confirmarAcao() {
    if (!this.reservaSelecionada || !this.modalAcao) return;

    if (this.modalAcao === 'finalizar') {
      this.reservaSelecionada.status = 'finalizada';
      this.reservasAtivas = this.reservasAtivas.filter(r => r.id !== this.reservaSelecionada!.id);
      this.historicoReservas.unshift(this.reservaSelecionada);
      this.avaliando.unshift(false);
      this.avaliado.unshift(false);
      this.nota.unshift(0);
      this.comentario.unshift('');

      this.reservaService.atualizarStatusReserva(this.reservaSelecionada.id, 'finalizada').subscribe({
        next: () => console.log('Reserva finalizada com sucesso.'),
        error: (err) => console.error('Erro ao finalizar reserva:', err)
      });

    } else if (this.modalAcao === 'cancelar') {
      this.reservaSelecionada.status = 'cancelada';
      this.reservasAtivas = this.reservasAtivas.filter(r => r.id !== this.reservaSelecionada!.id);
      this.historicoReservas.unshift(this.reservaSelecionada);
      this.avaliando.unshift(false);
      this.avaliado.unshift(true);
      this.nota.unshift(0);
      this.comentario.unshift('');

      this.reservaService.atualizarStatusReserva(this.reservaSelecionada.id, 'cancelada').subscribe({
        next: () => console.log('Reserva cancelada com sucesso.'),
        error: (err) => console.error('Erro ao cancelar reserva:', err)
      });
    }

    this.fecharModal();
  }

  // === Avaliações ===
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
      alert('Avaliação enviada com sucesso!'); // modal pode substituir o alert
      this.avaliando[index] = false;
      this.avaliado[index] = true;
    },
    error: (err) => {
      console.error('Erro ao enviar avaliação:', err);
      alert('Erro ao enviar avaliação. Tente novamente.');
    }
  });
}

  // Fechar modal de sucesso
  fecharModalSucesso() {
    this.modalSucessoAberto = false;
    this.mensagemModal = '';
  }
}
