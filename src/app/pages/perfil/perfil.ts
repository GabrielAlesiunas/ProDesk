import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,          // necessário para Angular 17+ Standalone Component
  imports: [CommonModule],    // importa CommonModule para usar *ngIf
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil {
  // Aba ativa, padrão é 'dados'
  activeTab: 'dados' | 'seguranca' | 'pagamento' = 'dados';

  // Método para trocar a aba
  selectTab(tab: 'dados' | 'seguranca' | 'pagamento') {
    this.activeTab = tab;
  }
}
