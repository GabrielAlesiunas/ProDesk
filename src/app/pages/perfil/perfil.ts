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

  usuarioNome: string = '';
  usuarioFoto: string = '';

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
      // Redireciona para login se não tiver logado
      this.router.navigate(['/login']);
      return;
    }

    const dados = JSON.parse(usuario);
    this.usuarioId = dados.id;
    this.usuarioNome = dados.nome;
    this.usuarioFoto = dados.foto || '';

    this.carregarDadosUsuario();
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

        // Atualiza localStorage
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

  // Ativa edição inline
  editarCampo(campo: 'nome' | 'email' | 'telefone' | 'endereco') {
    this.editando[campo] = true;
  }

  // Salva edição inline
  salvarCampo(campo: 'nome' | 'email' | 'telefone' | 'endereco', valor: string) {
    if (!valor || valor.trim() === '') return;

    const dados: any = {};
    dados[campo] = valor.trim();

    this.perfilService.atualizarDados(this.usuarioId, dados).subscribe({
      next: () => {
        (this as any)[campo] = valor.trim();
        this.editando[campo] = false;

        // Atualiza localStorage
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
    const numero = prompt('Número do cartão:');
    const validade = prompt('Validade (MM/AA):');
    const titular = prompt('Titular:');
    const cvv = prompt('CVV:');
    if (numero && validade && titular && cvv) {
      this.perfilService.adicionarCartao(this.usuarioId, { numero, validade, titular, cvv }).subscribe({
        next: () => alert('Cartão adicionado!'),
        error: err => alert(`Erro ao adicionar cartão: ${err.error?.message || err.message}`)
      });
    }
  }

  removerCartao() {
    const cartaoId = prompt('ID do cartão a remover:');
    if (cartaoId) {
      this.perfilService.removerCartao(this.usuarioId, Number(cartaoId)).subscribe({
        next: () => alert('Cartão removido!'),
        error: err => alert(`Erro ao remover cartão: ${err.error?.message || err.message}`)
      });
    }
  }
}
