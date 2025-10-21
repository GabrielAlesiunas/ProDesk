import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilService } from './../../services/perfil';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil {
  activeTab: 'dados' | 'seguranca' | 'pagamento' = 'dados';
  usuarioId = 1; // ID do usuário logado

  // Dados do usuário
  nome = 'Carlos Silva';
  email = 'carlos@email.com';
  telefone = '(15) 3238-188';
  endereco = 'Rodovia Senador José Ermirio de Moraes, 1425 - Sorocaba, SP';
  fotoPerfil = 'assets/carlos.jpg';

  constructor(private perfilService: PerfilService) {}

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
            // Atualiza o valor local para refletir na tela
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
            // Atualiza a foto local
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
