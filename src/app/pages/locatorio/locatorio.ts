import { Component, OnInit } from '@angular/core';
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
export class Locatorio implements OnInit {
  espacos: any[] = [];
  espacosFiltrados: any[] = [];
  espacoSelecionado: any = null;
  imagemIndex = 0;

  modalReservaAberto = false; // controla modal de reserva
  espacoParaReserva: any = null;

  // Campos de filtro
  termoBusca: string = '';
  filtroAvaliacao: string = '';
  filtroPreco: string = '';

  // Usuário logado
  usuarioNome: string = '';
  usuarioFoto: string = '';
  usuarioId: number = 0;

  constructor(
    private espacosService: Espacos,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    // Recupera usuário logado
    const usuario = this.auth.getUsuarioLogado();
    if (usuario) {
      this.usuarioNome = usuario.nome;
      this.usuarioFoto = usuario.foto;
      this.usuarioId = usuario.id;
    }

    // Atualiza se storage mudar
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

    // Busca espaços
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
          avaliacao: e.avaliacao_media
        }));
        this.espacosFiltrados = [...this.espacos];
      },
      error: (err) => console.error('Erro ao buscar espaços:', err)
    });
  }

  // Logout
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // Filtrar espaços
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

    this.espacosFiltrados = resultado;
  }

  // Abrir detalhes do espaço
  abrirDetalhes(espaco: any) {
    this.espacoSelecionado = { ...espaco };
    this.imagemIndex = 0;

    // Buscar opiniões
    this.espacosService.getAvaliacoes(espaco.id).subscribe({
      next: (avaliacoes) => {
        this.espacoSelecionado.opinioes = avaliacoes.map(a => ({
          usuario: a.usuario_nome,
          foto: a.usuario_foto || 'https://via.placeholder.com/40',
          texto: a.texto
        }));
      },
      error: (err) => console.error('Erro ao buscar avaliações:', err)
    });
  }

  fecharModal() {
    this.espacoSelecionado = null;
  }

  // Carrossel
  proximaImagem() {
    if (this.espacoSelecionado?.imagens?.length) {
      this.imagemIndex =
        (this.imagemIndex + 1) % this.espacoSelecionado.imagens.length;
    }
  }

  anteriorImagem() {
    if (this.espacoSelecionado?.imagens?.length) {
      this.imagemIndex =
        (this.imagemIndex - 1 + this.espacoSelecionado.imagens.length) %
        this.espacoSelecionado.imagens.length;
    }
  }

  abrirPerfil(dono: any) {
    if (dono) alert(`Abrindo perfil de ${dono.nome}`);
    else alert('Dono desconhecido');
  }

  // ====================
  // Modal de reserva
  // ====================
  abrirReserva(espaco: any) {
    this.espacoParaReserva = espaco;
    this.modalReservaAberto = true;
  }

  fecharReserva() {
    this.modalReservaAberto = false;
  }
}
