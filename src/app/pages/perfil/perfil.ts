import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilService } from './../../services/perfil';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  activeTab: 'dados' | 'seguranca' | 'pagamento' = 'dados';
  usuarioId: number = 0;

  usuarioNome = '';
  usuarioFoto = '';

  // Modal de cartão
  modalCartaoAberto = false;

  // Preview do cartão em tempo real
  previewCartao: any = {
    numero: '',
    numeroFormatado: '',
    titular: '',
    validade: '',
    cvv: ''
  };

  cartoes: any[] = [];           // Lista de cartões do usuário
  cartaoSelecionadoId: number | null = null; // Cartão selecionado

  // Dados do usuário
  nome = '';
  email = '';
  telefone = '';
  cpf = '';
  endereco = '';
  fotoPerfil = '';

  // Edição inline
  editando: { [key: string]: boolean } = {};

  constructor(private perfilService: PerfilService, private router: Router) { }

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuarioLogado');
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    const dados = JSON.parse(usuario);
    this.usuarioId = dados.id;
    this.usuarioNome = dados.nome;
    this.usuarioFoto = dados.foto || '';

    this.carregarDadosUsuario();
    this.carregarCartoes();
  }

  carregarDadosUsuario() {
    this.perfilService.obterDados(this.usuarioId).subscribe({
      next: usuario => {
        this.nome = usuario.nome;
        this.email = usuario.email;
        this.telefone = usuario.telefone;
        this.cpf = usuario.cpf;
        this.endereco = usuario.endereco;
        this.fotoPerfil = usuario.foto || this.fotoPerfil;

        localStorage.setItem('usuarioLogado', JSON.stringify({
          id: usuario.id,
          nome: usuario.nome,
          foto: usuario.foto
        }));
        window.dispatchEvent(new Event('storage'));
      },
      error: err => console.error('Erro ao carregar dados do usuário:', err)
    });
  }

  selectTab(tab: 'dados' | 'seguranca' | 'pagamento') {
    this.activeTab = tab;
  }

  editarCampo(campo: 'nome' | 'email' | 'telefone' | 'endereco') {
    this.editando[campo] = true;
  }

  salvarCampo(campo: 'nome' | 'email' | 'telefone' | 'endereco', valor: string) {
    if (!valor || valor.trim() === '') return;

    const dados: any = {};
    dados[campo] = valor.trim();

    this.perfilService.atualizarDados(this.usuarioId, dados).subscribe({
      next: () => {
        (this as any)[campo] = valor.trim();
        this.editando[campo] = false;

        const usuario = localStorage.getItem('usuarioLogado');
        if (usuario) {
          const usuarioData = JSON.parse(usuario);
          if (campo === 'nome') usuarioData.nome = valor.trim();
          localStorage.setItem('usuarioLogado', JSON.stringify(usuarioData));
          window.dispatchEvent(new Event('storage'));
        }
      },
      error: err => alert(`Erro ao atualizar ${campo}: ${err.error?.message || err.message}`)
    });
  }

  cancelarEdicao(campo: string) {
    this.editando[campo] = false;
  }

  // Valida e formata CVV
  onCvvChange(valor: string) {
    this.previewCartao.cvv = valor.replace(/\D/g, '').slice(0, 3);
  }

  // Atualiza foto do usuário
  onFotoSelecionada(event: any) {
    const arquivo: File = event.target.files[0];
    if (!arquivo) return;

    this.perfilService.atualizarFoto(this.usuarioId, arquivo).subscribe({
      next: () => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fotoPerfil = e.target.result;
          const usuario = localStorage.getItem('usuarioLogado');
          if (usuario) {
            const usuarioData = JSON.parse(usuario);
            usuarioData.foto = this.fotoPerfil;
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioData));
            window.dispatchEvent(new Event('storage'));
          }
        };
        reader.readAsDataURL(arquivo);
      },
      error: err => alert(`Erro ao atualizar foto: ${err.error?.message || err.message}`)
    });
  }

  alterarSenha() {
    const senhaAtual = prompt('Digite sua senha atual:');
    const novaSenha = prompt('Digite a nova senha:');
    if (senhaAtual && novaSenha) {
      this.perfilService.alterarSenha(this.usuarioId, senhaAtual, novaSenha).subscribe({
        next: () => alert('Senha alterada com sucesso!'),
        error: err => alert(`Erro ao alterar senha: ${err.error?.message || err.message}`)
      });
    }
  }

  ativar2FA() {
    alert('Autenticação de dois fatores ativada!');
  }

  adicionarCartao() {
    this.modalCartaoAberto = true;
    this.previewCartao = { numero: '', numeroFormatado: '', titular: '', validade: '', cvv: '' };
  }

  // Formata número do cartão a cada 4 dígitos e limita a 16
  onNumeroCartaoChange(valor: string) {
    const apenasDigitos = valor.replace(/\D/g, '').slice(0, 16);
    this.previewCartao.numero = apenasDigitos;
    this.previewCartao.numeroFormatado = apenasDigitos.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  // Formata validade como MM/AA
  onValidadeChange(valor: string) {
    let apenasDigitos = valor.replace(/\D/g, '').slice(0, 4);
    if (apenasDigitos.length >= 3) {
      this.previewCartao.validade = apenasDigitos.slice(0, 2) + '/' + apenasDigitos.slice(2);
    } else {
      this.previewCartao.validade = apenasDigitos;
    }
  }

  salvarCartao() {
    const { numero, titular, validade, cvv } = this.previewCartao;

    if (!numero || !titular || !validade || !cvv) {
      return alert('Preencha todos os campos.');
    }

    const cartaoParaEnvio = {
      numero: numero.replace(/\s/g, ''), // remove espaços
      nome: titular,
      validade,
      cvv
    };

    this.perfilService.adicionarCartao(this.usuarioId, cartaoParaEnvio).subscribe({
      next: () => {
        alert('Cartão adicionado com sucesso!');
        this.modalCartaoAberto = false;
        this.carregarCartoes(); // ← Atualiza a lista
      },
      error: err => alert(`Erro ao adicionar cartão: ${err.error?.message || err.message}`)
    });
  }

  carregarCartoes() {
    this.perfilService.obterCartoes(this.usuarioId).subscribe({
      next: (cartoes: any[]) => {
        this.cartoes = cartoes;
      },
      error: err => console.error('Erro ao carregar cartões:', err)
    });
  }


  removerCartao() {
    if (!this.cartaoSelecionadoId) {
      return alert('Selecione um cartão para remover.');
    }

    this.perfilService.removerCartao(this.usuarioId, this.cartaoSelecionadoId).subscribe({
      next: () => {
        alert('Cartão removido com sucesso!');
        // Atualiza a lista
        this.carregarCartoes();
        this.cartaoSelecionadoId = null;
      },
      error: err => alert(`Erro ao remover cartão: ${err.error?.message || err.message}`)
    });
  }

}
