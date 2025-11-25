import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Espacos } from './../../services/espacos';
import { Auth } from './../../services/auth';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ReservaModal } from '../modal-reserva/modal-reserva';

@Component({
  selector: 'app-locatorio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive, ReservaModal],
  templateUrl: './locatorio.html',
  styleUrls: ['./locatorio.css']
})
export class Locatorio implements OnInit, OnDestroy {
  espacos: any[] = [];
  espacosFiltrados: any[] = [];
  espacoSelecionado: any = null;
  imagemIndex = 0;

  modalReservaAberto = false;
  espacoParaReserva: any = null;

  termoBusca: string = '';
  filtroAvaliacao: string = '';
  filtroPreco: string = '';
  filtroCompartilhavel: boolean = false;

  usuarioNome: string = '';
  usuarioFoto: string = '';
  usuarioId: number = 0;

  private modaisAbertos = 0;
  private scrollYAntes = 0;

  constructor(
    private espacosService: Espacos,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    const usuario = this.auth.getUsuarioLogado();
    if (usuario) {
      this.usuarioNome = usuario.nome;
      this.usuarioFoto = usuario.foto;
      this.usuarioId = usuario.id;
    }

    window.addEventListener('storage', () => {
      const usuario = this.auth.getUsuarioLogado();
      if (usuario) {
        this.usuarioNome = usuario.nome;
        this.usuarioFoto = usuario.foto;
        this.usuarioId = usuario.id;
      } else {
        this.usuarioNome = '';
        this.usuarioFoto = '';
        this.usuarioId = 0;
      }
    });

    this.espacosService.getEspacos().subscribe({
      next: (dados) => {
        this.espacos = dados.map(e => ({
          ...e,
          imagens: e.imagens ? JSON.parse(e.imagens) : [],
          comodidades: e.comodidades ? JSON.parse(e.comodidades) : [],
          dono: {
            nome: e.dono_nome,
            foto: e.dono_foto
          },
          avaliacao: e.avaliacao_media,
          compartilhavel: !!e.compartilhavel,
          capacidadeMax: e.capacidade_max || 0,
          pessoasAtuais: e.pessoas_atuais || 0
        }));
        this.espacosFiltrados = [...this.espacos];
      },
      error: (err) => console.error('Erro ao buscar espaços:', err)
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  filtrarEspacos() {
    let resultado = [...this.espacos];

    if (this.termoBusca) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(e =>
        e.nome.toLowerCase().includes(termo) ||
        (e.dono?.nome?.toLowerCase().includes(termo) ?? false)
      );
    }

    if (this.filtroAvaliacao) {
      const aval = parseFloat(this.filtroAvaliacao);
      resultado = resultado.filter(e => e.avaliacao >= aval);
    }

    if (this.filtroPreco) {
      resultado.sort((a, b) =>
        this.filtroPreco === 'asc'
          ? a.precoHora - b.precoHora
          : b.precoHora - a.precoHora
      );
    }

    if (this.filtroCompartilhavel) {
      resultado = resultado.filter(e => e.compartilhavel);
    }

    this.espacosFiltrados = resultado;
  }

  // === BLOQUEIO DE SCROLL ===
  private lockScroll() {
    this.modaisAbertos++;
    if (this.modaisAbertos > 1) return;

    this.scrollYAntes = window.scrollY || window.pageYOffset || 0;

    document.documentElement.classList.add('modal-aberto');
    document.body.classList.add('modal-aberto');

    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollYAntes}px`;
    document.body.style.width = '100%';
  }

  private unlockScroll() {
    this.modaisAbertos = Math.max(0, this.modaisAbertos - 1);
    if (this.modaisAbertos > 0) return;

    document.documentElement.classList.remove('modal-aberto');
    document.body.classList.remove('modal-aberto');

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    window.scrollTo(0, this.scrollYAntes || 0);
    this.scrollYAntes = 0;
  }

  // === MODAL DE DETALHES ===
  abrirDetalhes(espaco: any) {
    this.espacoSelecionado = { ...espaco };
    this.imagemIndex = 0;
    this.lockScroll();

    this.espacosService.getAvaliacoes(espaco.id).subscribe({
      next: (avaliacoes) => {
        this.espacoSelecionado.opinioes = avaliacoes.map(a => ({
          usuario: a.usuario_nome,
          foto: a.usuario_foto || 'https://via.placeholder.com/40',
          texto: a.comentario,
          nota: a.nota
        }));
      },
      error: (err) => console.error('Erro ao buscar avaliações:', err)
    });
  }

  fecharModal() {
    this.espacoSelecionado = null;
    this.unlockScroll();
  }

  proximaImagem() {
    if (this.espacoSelecionado?.imagens?.length) {
      this.imagemIndex = (this.imagemIndex + 1) % this.espacoSelecionado.imagens.length;
    }
  }

  anteriorImagem() {
    if (this.espacoSelecionado?.imagens?.length) {
      this.imagemIndex = (this.imagemIndex - 1 + this.espacoSelecionado.imagens.length) %
        this.espacoSelecionado.imagens.length;
    }
  }

  abrirPerfil(dono: any) {
    if (dono) alert(`Abrindo perfil de ${dono.nome}`);
    else alert('Dono desconhecido');
  }

  // === MODAL DE RESERVA ===
  abrirReserva(espaco: any) {
    this.espacoParaReserva = espaco;
    this.modalReservaAberto = true;
    this.lockScroll();
  }

  fecharReserva() {
    this.modalReservaAberto = false;
    this.espacoParaReserva = null;
    this.unlockScroll();
  }

  // Limpa qualquer bloqueio restante se o componente for destruído
  ngOnDestroy() {
    document.documentElement.classList.remove('modal-aberto');
    document.body.classList.remove('modal-aberto');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
  }
}
