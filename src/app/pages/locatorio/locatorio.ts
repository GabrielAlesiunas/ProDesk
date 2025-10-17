import { Component } from '@angular/core';

@Component({
  selector: 'app-locatorio',
  imports: [],
  templateUrl: './locatorio.html',
  styleUrl: './locatorio.css'
})
export class Locatorio {
espacos = [
    { nome: 'Coworking Central', descricao: 'Espaço moderno com salas privativas e compartilhadas.' },
    { nome: 'Hub Criativo', descricao: 'Ambiente colaborativo para startups e freelancers.' },
    { nome: 'Espaço Verde', descricao: 'Coworking com áreas ao ar livre e coworking indoor.' }
  ];
}
