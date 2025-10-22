import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilService } from './../../services/perfil';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  activeTab: 'dados' | 'seguranca' | 'pagamento' = 'dados';
  usuarioId = 1; // ID do usuário logado

  // Dados do usuário
  nome = 'Carlos Silva';
  email = 'carlos@email.com';
  telefone = '(15) 3238-188';
  endereco = 'Rodovia Senador José Ermirio de Moraes, 1425 - Sorocaba, SP';
  fotoPerfil = 'assets/carlos.jpg';

  // 👇 Adicionados
  usuarioNome: string = '';
  usuarioFoto: string = '';

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    // 🔹 Pega nome e foto do usuário logado no localStorage
    const usuario = localStorage.getItem('usuarioLogado');
    if (usuario) {
      const dados = JSON.parse(usuario);
      this.usuarioNome = dados.nome;
      this.usuarioFoto = dados.foto;

      // Atualiza também os dados do perfil se quiser sincronizar
      this.nome = dados.nome;
      this.email = dados.email;
      this.fotoPerfil = dados.foto || this.fotoPerfil;
      this.usuarioId = dados.id || this.usuarioId;
    }
  }

  // Trocar abas
  selectTab(tab: 'dados' | 'seguranca' | 'pagamento') {
    this.activeTab = tab;
  }

  // Editar dados pessoais
  editarCampo(campo: string, valorAtual: string) {
    const novoValor = prompt(`Digite novo ${campo}:`, valorAtual);
    if (novoValor) {
      const dados: any = {};
      dados[campo] = novoValor;
      this.perfilService.atualizarDados(this.usuarioId, dados)
        .subscribe({
          next: () => {
            alert(`${campo} atualizado com sucesso!`);
            (this as any)[campo] = novoValor;
          },
          error: (err) => alert(`Erro ao atualizar ${campo}: ${err.error?.message || err.message}`)
        });
    }
  }

  // Alterar foto de perfil
  onFotoSelecionada(event: any) {
    const arquivo: File = event.target.files[0];
    if (arquivo) {
      this.perfilService.atualizarFoto(this.usuarioId, arquivo)
        .subscribe({
          next: () => {
            alert('Foto atualizada!');
            const reader = new FileReader();
            reader.onload = (e: any) => this.fotoPerfil = e.target.result;
            reader.readAsDataURL(arquivo);
          },
          error: (err) => alert(`Erro ao atualizar foto: ${err.error?.message || err.message}`)
        });
    }
  }

  // Alterar senha
  alterarSenha() {
    const senhaAtual = prompt('Digite sua senha atual:');
    const novaSenha = prompt('Digite a nova senha:');
    if (senhaAtual && novaSenha) {
      this.perfilService.alterarSenha(this.usuarioId, senhaAtual, novaSenha)
        .subscribe({
          next: () => alert('Senha alterada com sucesso!'),
          error: (err) => alert(`Erro ao alterar senha: ${err.error?.message || err.message}`)
        });
    }
  }

  // Ativar 2FA (simulação)
  ativar2FA() {
    alert('Autenticação de dois fatores ativada!');
  }

  // Adicionar cartão (simulação)
  adicionarCartao() {
    const numero = prompt('Número do cartão:');
    const validade = prompt('Validade (MM/AA):');
    const titular = prompt('Titular:');
    const cvv = prompt('CVV:');
    if (numero && validade && titular && cvv) {
      this.perfilService.adicionarCartao(this.usuarioId, { numero, validade, titular, cvv })
        .subscribe({
          next: () => alert('Cartão adicionado!'),
          error: (err) => alert(`Erro ao adicionar cartão: ${err.error?.message || err.message}`)
        });
    }
  }

  // Remover cartão (simulação)
  removerCartao() {
    const cartaoId = prompt('ID do cartão a remover:');
    if (cartaoId) {
      this.perfilService.removerCartao(this.usuarioId, Number(cartaoId))
        .subscribe({
          next: () => alert('Cartão removido!'),
          error: (err) => alert(`Erro ao remover cartão: ${err.error?.message || err.message}`)
        });
    }
  }
}
