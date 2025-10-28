import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-status-pagamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-pagamento.html',
  styleUrls: ['./status-pagamento.css']
})
export class StatusPagamento {

  @Input() sucesso: boolean = true; // true = pagamento aprovado, false = falha
  @Output() fecharModal = new EventEmitter<void>();

  constructor(private router: Router) {}

  voltar() {
    this.fecharModal.emit(); // fecha modal
    this.router.navigate(['/locatorio']); // redireciona para página de espaços
  }
}
