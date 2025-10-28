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

  imagemFile: File | null = null;
  comodidades: string[] = [];
  novasComodidades: string = '';

  constructor(private router: Router, private espacosService: Espacos) { }

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuarioLogado');
    if (usuario) {
      const dados = JSON.parse(usuario);
      this.usuarioNome = dados.nome;
      this.usuarioFoto = dados.foto;
      console.log('Usuário logado:', dados);
    }
  }

  logout(): void {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }

  adicionarComodidade(): void {
    if (this.novasComodidades.trim()) {
      this.comodidades.push(this.novasComodidades.trim());
      console.log('Comodidades atuais:', this.comodidades);
      this.novasComodidades = '';
    }
  }

  removerComodidade(index: number): void {
    this.comodidades.splice(index, 1);
    console.log('Comodidades após remoção:', this.comodidades);
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.imagemFile = event.target.files[0];
      console.log('Arquivo selecionado:', this.imagemFile);
    }
  }

  cadastrarEspaco(): void {
    if (!this.nome || !this.preco) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuarioLogado')!);
    console.log('Dados do usuário:', usuario);

    const formData = new FormData();
    formData.append('nome', this.nome);
    formData.append('descricao', this.descricao);
    formData.append('precoHora', String(this.preco));
    formData.append('dono_id', String(usuario.id));
    formData.append('comodidades', JSON.stringify(this.comodidades));

    if (this.imagemFile) {
      formData.append('imagem', this.imagemFile, this.imagemFile.name);
    }

    // Log para verificar conteúdo do FormData
    console.log('FormData antes do envio:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.espacosService.cadastrarEspaco(formData).subscribe({
      next: (res) => {
        console.log('Resposta do servidor:', res);
        alert('Espaço cadastrado com sucesso!');
        this.router.navigate(['/locatorio']);
      },
      error: (err) => {
        console.error('Erro ao cadastrar espaço:', err);
        alert('Erro ao cadastrar espaço. Veja o console para detalhes.');
      }
    });
  }
}
