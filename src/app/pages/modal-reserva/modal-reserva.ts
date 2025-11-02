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

  atualizarDisponibilidade() {
    this.calcularPreco();
    this.verificarDisponibilidade();
    if (this.espaco.compartilhavel) this.atualizarOcupacao();
  }

  calcularPreco() {
    if (!this.espaco || !this.horaInicio || !this.horaFim) { this.precoTotal = 0; return; }
    const [hIni, mIni] = this.horaInicio.split(':').map(Number);
    const [hFim, mFim] = this.horaFim.split(':').map(Number);
    let duracao = (hFim + mFim / 60) - (hIni + mIni / 60);
    if (duracao < 0) duracao = 0;
    this.precoTotal = duracao * this.espaco.precoHora;
  }

verificarDisponibilidade() {
  if (!this.espaco || !this.data || !this.horaInicio || !this.horaFim) {
    this.disponivel = null;
    return;
  }

  this.carregando = true;

  // Para todos os espaços, verificamos a ocupação
  this.reservaService.getOcupacao(this.espaco.id, this.data, this.horaInicio, this.horaFim)
    .subscribe({
      next: (res) => {
        const ocupacaoAtual = res.ocupacao || 0;

        if (this.espaco.compartilhavel && this.espaco.capacidade_max) {
          // Espaços compartilháveis: comparar com capacidade_max
          this.disponivel = ocupacaoAtual < this.espaco.capacidade_max;
        } else {
          // Espaços não compartilháveis: disponível se ninguém reservou
          this.disponivel = ocupacaoAtual === 0;
        }

        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao verificar disponibilidade:', err);
        this.disponivel = false;
        this.carregando = false;
      }
    });
}

  atualizarOcupacao() {
    if (!this.espaco || !this.data || !this.horaInicio || !this.horaFim) return;
    this.reservaService.getOcupacao(this.espaco.id, this.data, this.horaInicio, this.horaFim)
      .subscribe({
        next: (res) => this.espaco.usuariosAtuais = res.ocupacao,
        error: () => this.espaco.usuariosAtuais = 0
      });
  }

  confirmarPagamento() {
    if (this.formaPagamento === 'Cartão' && !this.cartaoSelecionado) {
      alert('Selecione um cartão.');
      return;
    }

    this.pagamentoEmProcesso = true;

    timer(3000).subscribe(() => {
      this.pagamentoEmProcesso = false;
      const sucessoPagamento = true;

      if (sucessoPagamento) {
        this.reservar(() => { this.abrirStatusModal(true); });
      } else {
        this.abrirStatusModal(false);
      }
    });
  }

  abrirStatusModal(sucesso: boolean) {
    if (this.statusModalRef) this.statusModalRef.destroy();
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

    console.log('📦 Enviando reserva para o backend:', reserva);
    
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
