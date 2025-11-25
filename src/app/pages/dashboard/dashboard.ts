import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Dashboard } from '../../services/dashboard';
import { Auth } from '../../services/auth';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  providers: [Dashboard],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  // === USUÁRIO LOGADO ===
  usuarioNome: string = '';
  usuarioFoto: string = '';
  usuarioId: number = 0;

  // === INDICADORES ===
  totalReservas = 0;
  reservasAtivas = 0;
  faturamentoTotal = 0;
  avaliacaoMedia = 0;
  totalClientes = 0;

  // === REFERÊNCIAS AOS GRÁFICOS ===
  private reservasMesChart?: Chart;
  private tiposEspacoChart?: Chart;
  private faturamentoChart?: Chart;

  // === IDs DOS CANVAS ===
  reservasMesCanvasId = 'reservasMesChart';
  tiposEspacoCanvasId = 'tiposEspacoChart';
  faturamentoCanvasId = 'faturamentoChart';

  constructor(
    private svc: Dashboard,
    private auth: Auth,
    private router: Router
  ) {}

  // ===========================
  // CARREGA USUÁRIO LOGADO
  // ===========================
  ngOnInit(): void {
    const usuario = this.auth.getUsuarioLogado();

    if (usuario) {
      this.usuarioNome = usuario.nome;
      this.usuarioFoto = usuario.foto;
      this.usuarioId = usuario.id;
    }

    // Atualiza se o usuário mudar em outra aba
    window.addEventListener('storage', () => {
      const user = this.auth.getUsuarioLogado();
      if (user) {
        this.usuarioNome = user.nome;
        this.usuarioFoto = user.foto;
        this.usuarioId = user.id;
      } else {
        this.usuarioNome = '';
        this.usuarioFoto = '';
        this.usuarioId = 0;
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // ===========================
  // INICIALIZA GRÁFICOS
  // ===========================
  ngAfterViewInit(): void {
    this.loadIndicators();
    this.loadChartsData();
  }

  ngOnDestroy(): void {
    this.reservasMesChart?.destroy();
    this.tiposEspacoChart?.destroy();
    this.faturamentoChart?.destroy();
  }

  // ===========================
  // INDICADORES
  // ===========================
  private loadIndicators() {
    this.svc.getIndicators().subscribe({
      next: (data) => {
        this.totalReservas = data.totalReservas ?? 0;
        this.reservasAtivas = data.reservasAtivas ?? 0;
        this.faturamentoTotal = data.faturamentoTotal ?? 0;
        this.avaliacaoMedia = data.avaliacaoMedia ?? 0;
        this.totalClientes = data.totalClientes ?? 0;
      },
      error: (err) => {
        console.error('Erro ao carregar indicadores', err);
        this.totalReservas = 128;
        this.reservasAtivas = 9;
        this.faturamentoTotal = 12540.50;
        this.avaliacaoMedia = 4.3;
        this.totalClientes = 78;
      }
    });
  }

  // ===========================
  // GRÁFICOS
  // ===========================
  private loadChartsData() {
    this.svc.getReservasPorMes().subscribe({
      next: (res) => this.buildReservasMesChart(res),
      error: () => this.buildReservasMesChart(this.mockReservasPorMes())
    });

    this.svc.getTiposEspacoMaisReservados().subscribe({
      next: (res) => this.buildTiposEspacoChart(res),
      error: () => this.buildTiposEspacoChart(this.mockTiposEspaco())
    });

    this.svc.getFaturamentoMensal().subscribe({
      next: (res) => this.buildFaturamentoChart(res),
      error: () => this.buildFaturamentoChart(this.mockFaturamentoMensal())
    });
  }

  private buildReservasMesChart(data: { labels: string[]; values: number[] }) {
    const ctx = (document.getElementById(this.reservasMesCanvasId) as HTMLCanvasElement).getContext('2d')!;
    this.reservasMesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Reservas',
          data: data.values,
          borderRadius: 6,
          barThickness: 24,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true }
        }
      }
    });
  }

  private buildTiposEspacoChart(data: { labels: string[]; values: number[] }) {
    const ctx = (document.getElementById(this.tiposEspacoCanvasId) as HTMLCanvasElement).getContext('2d')!;
    this.tiposEspacoChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  private buildFaturamentoChart(data: { labels: string[]; values: number[] }) {
    const ctx = (document.getElementById(this.faturamentoCanvasId) as HTMLCanvasElement).getContext('2d')!;
    this.faturamentoChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Faturamento (R$)',
          data: data.values,
          fill: true,
          tension: 0.3,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true }
        }
      }
    });
  }

  // ===========================
  // MOCKS DE BACKUP
  // ===========================
  private mockReservasPorMes() {
    return {
      labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
      values: [8,12,15,10,18,20,14,16,11,9,13,17]
    };
  }

  private mockTiposEspaco() {
    return {
      labels: ['Sala Reunião','Mesa Avulsa','Sala Privada','Auditório'],
      values: [45, 30, 18, 7]
    };
  }

  private mockFaturamentoMensal() {
    return {
      labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
      values: [3000,4200,3800,4500,5600,6000,4800,5200,4100,3900,4300,5000]
    };
  }
}
