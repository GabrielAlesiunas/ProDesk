import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Espacos } from './../../services/espacos';

@Component({
  selector: 'app-locatorio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './locatorio.html',
  styleUrls: ['./locatorio.css']
})
export class Locatorio implements OnInit {
  espacos: any[] = [];
  espacosFiltrados: any[] = [];
  espacoSelecionado: any = null;
  imagemIndex = 0;

  // Campos de filtro
  termoBusca: string = '';
  filtroAvaliacao: string = '';
  filtroPreco: string = '';

  constructor(private espacosService: Espacos) {}

  ngOnInit() {
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

  // Filtra espaços por termo de busca, avaliação e preço
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

  // Abre modal com detalhes do espaço
  abrirDetalhes(espaco: any) {
    this.espacoSelecionado = { ...espaco };
    this.imagemIndex = 0;

    // Buscar opiniões do backend
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

  // Fecha modal
  fecharModal() {
    this.espacoSelecionado = null;
  }

  // Carrossel: próxima imagem
  proximaImagem() {
    if (this.espacoSelecionado?.imagens?.length) {
      this.imagemIndex =
        (this.imagemIndex + 1) % this.espacoSelecionado.imagens.length;
    }
  }

  // Carrossel: imagem anterior
  anteriorImagem() {
    if (this.espacoSelecionado?.imagens?.length) {
      this.imagemIndex =
        (this.imagemIndex - 1 + this.espacoSelecionado.imagens.length) %
        this.espacoSelecionado.imagens.length;
    }
  }

  // Abrir perfil do dono
  abrirPerfil(dono: any) {
    if (dono) {
      alert(`Abrindo perfil de ${dono.nome}`);
    } else {
      alert('Dono desconhecido');
    }
  }
}
