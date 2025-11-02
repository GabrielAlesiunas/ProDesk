import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Espacos } from './../../services/espacos';

@Component({
  selector: 'app-cadastrar-espaco',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './cadastrar-espaco.html',
  styleUrls: ['./cadastrar-espaco.css']
})
export class CadastrarEspaco implements OnInit {
  usuarioNome: string = '';
  usuarioFoto: string = '';

  nome: string = '';
  descricao: string = '';
  preco: number | null = null;

  comodidades: string[] = [];
  novasComodidades: string = '';
  imagensSelecionadas: File[] = [];
  arquivosSelecionados: string = '';

  // modal
  modalAberto: boolean = false;
  mensagemModal: string = '';

  constructor(private router: Router, private espacosService: Espacos) { }

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuarioLogado');
    if (usuario) {
      const dados = JSON.parse(usuario);
      this.usuarioNome = dados.nome;
      this.usuarioFoto = dados.foto;
    }
  }

  logout(): void {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }

  adicionarComodidade(): void {
    if (this.novasComodidades.trim()) {
      this.comodidades.push(this.novasComodidades.trim());
      this.novasComodidades = '';
    }
  }

  removerComodidade(index: number): void {
    this.comodidades.splice(index, 1);
  }

  triggerFileInput() {
  const input = document.getElementById('imagens') as HTMLInputElement;
  input.click();
}

onFilesSelected(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    this.imagensSelecionadas = Array.from(event.target.files);
    this.arquivosSelecionados = this.imagensSelecionadas.map(f => f.name).join(', ');
  }
}

  cadastrarEspaco(): void {
    if (!this.nome || !this.preco) {
      this.mensagemModal = 'Preencha todos os campos obrigatórios.';
      this.modalAberto = true;
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuarioLogado')!);

    const formData = new FormData();
    formData.append('nome', this.nome);
    formData.append('descricao', this.descricao);
    formData.append('precoHora', String(this.preco));
    formData.append('dono_id', String(usuario.id));
    formData.append('comodidades', JSON.stringify(this.comodidades));

    // Adiciona todas as imagens
    this.imagensSelecionadas.forEach(file => {
      formData.append('imagens', file, file.name);
    });

    this.espacosService.cadastrarEspaco(formData).subscribe({
  next: (res: any) => {
    // Mostra o modal de sucesso
    this.mensagemModal = 'Espaço cadastrado com sucesso!';
    this.modalAberto = true;
    // Não navega ainda, espera o usuário fechar
  },
  error: (err) => {
    console.error(err);
    this.mensagemModal = 'Erro ao cadastrar espaço: ' + (err.error?.error || 'Verifique os dados');
    this.modalAberto = true;
  }
});
}

  fecharModal() {
  this.modalAberto = false;
  // Se quiser, navega após o modal ser fechado
  this.router.navigate(['/locatorio']);
  this.mensagemModal = '';
}
}
