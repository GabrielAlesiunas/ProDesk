import { Component, Input, OnInit, Output, EventEmitter, ComponentRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva';
import { StatusPagamento } from '../status-pagamento/status-pagamento';
import { Cartao } from '../../services/cartao';
import { timer } from 'rxjs';

@Component({
  selector: 'app-reserva-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-reserva.html',
  styleUrls: ['./modal-reserva.css']
})
export class ReservaModal implements OnInit {

  @Input() espaco: any;
  @Input() usuarioId: number = 0;
  @Output() fechar = new EventEmitter<void>();
  @Output() reservaFeita = new EventEmitter<void>();

  data: string = '';
  horaInicio: string = '';
  horaFim: string = '';
  formaPagamento: string = 'Cartão';
  precoTotal: number = 0;

  cartoesUsuario: any[] = [];
  cartaoSelecionado: any = null;
  pagamentoEmProcesso: boolean = false;

  disponivel: boolean | null = null;
  carregando: boolean = false;

  formasPagamento = ['Cartão', 'Pix', 'Boleto'];

  statusModalRef: ComponentRef<StatusPagamento> | null = null;

  constructor(
    private reservaService: ReservaService,
    private cartaoService: Cartao,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    if (this.espaco) this.precoTotal = this.espaco.precoHora;
    this.carregarCartoes();
  }

  carregarCartoes() {
    if (!this.usuarioId) return;
    this.cartaoService.listar(this.usuarioId).subscribe({
      next: (cartoes) => {
        this.cartoesUsuario = (cartoes || []).map((c: any) => {
          const numeroRaw = (c.numero || '').replace(/\s+/g, '');
          const last4 = numeroRaw.slice(-4);
          const numeroMask = numeroRaw ? `**** **** **** ${last4}` : '';
          return {
            ...c,
            numeroMask,
            titular: c.titular || ''
          };
        });
      },
      error: (err) => console.error('Erro ao carregar cartões:', err)
    });
  }

  onFormaPagamentoChange() {
    this.cartaoSelecionado = null;
  }

  verificarDisponibilidade() {
    if (!this.espaco || !this.data || !this.horaInicio || !this.horaFim) {
      this.disponivel = null;
      return;
    }
    this.carregando = true;
    this.reservaService.verificarDisponibilidade(this.espaco.id, this.data, this.horaInicio, this.horaFim)
      .subscribe({
        next: (res) => { this.disponivel = res.disponivel; this.carregando = false; },
        error: (err) => { console.error('Erro ao verificar disponibilidade:', err); this.disponivel = false; this.carregando = false; }
      });
  }

  calcularPreco() {
    if (!this.espaco || !this.horaInicio || !this.horaFim) { this.precoTotal = 0; return; }
    const [hIni, mIni] = this.horaInicio.split(':').map(Number);
    const [hFim, mFim] = this.horaFim.split(':').map(Number);
    let duracao = (hFim + mFim / 60) - (hIni + mIni / 60);
    if (duracao < 0) duracao = 0;
    this.precoTotal = duracao * this.espaco.precoHora;
  }

  confirmarPagamento() {
    if (this.formaPagamento === 'Cartão' && !this.cartaoSelecionado) {
      alert('Selecione um cartão.');
      return;
    }

    this.pagamentoEmProcesso = true;

    // Timer de 3 segundos para simular processamento
    timer(3000).subscribe(() => {
      this.pagamentoEmProcesso = false;

      const sucessoPagamento = true; // simula sucesso; pode alterar para false para teste de falha

      if (sucessoPagamento) {
        // Cria a reserva no banco
        this.reservar(() => {
          // Abre modal de status após criar reserva
          this.abrirStatusModal(true);
        });
      } else {
        // Falha no pagamento, apenas abre modal de status
        this.abrirStatusModal(false);
      }
    });
  }

  abrirStatusModal(sucesso: boolean) {
    if (this.statusModalRef) {
      this.statusModalRef.destroy();
    }

    this.statusModalRef = this.viewContainerRef.createComponent(StatusPagamento);
    this.statusModalRef.instance.sucesso = sucesso;

    this.statusModalRef.instance.fecharModal.subscribe(() => {
      this.statusModalRef?.destroy();
      this.fechar.emit();
    });
  }

  reservar(callback?: Function) {
    if (!this.disponivel) {
      alert('Este horário não está disponível.');
      return;
    }

    const reserva = {
      usuario_id: this.usuarioId,
      espaco_id: this.espaco.id,
      data_reserva: this.data,
      hora_inicio: this.horaInicio,
      hora_fim: this.horaFim,
      preco: this.precoTotal,
      forma_pagamento: this.formaPagamento
    };

    this.reservaService.criarReserva(reserva).subscribe({
      next: () => {
        this.reservaFeita.emit();
        if (callback) callback();
      },
      error: (err) => { console.error('Erro ao criar reserva:', err); alert('Erro ao realizar reserva.'); }
    });
  }

  fecharModal() {
    this.fechar.emit();
  }
}
