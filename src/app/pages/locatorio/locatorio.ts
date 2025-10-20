import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-locatorio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './locatorio.html',
  styleUrls: ['./locatorio.css']
})
export class Locatorio {
  imagemIndex = 0;
  espacoSelecionado: any = null;

  espacos = [
    {
      nome: 'Coworking Central',
      descricao: 'Espaço moderno com salas privativas e compartilhadas.',
      imagem: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80'
      ],
      avaliacao: 4.8,
      precoHora: 25,
      comodidades: ['Wi-Fi', 'Café', 'Salas Privativas', 'Estacionamento'],
      dono: { nome: 'Carlos Mendes', foto: 'https://randomuser.me/api/portraits/men/32.jpg', perfilImagem: 'https://images.unsplash.com/photo-1531379410502-63bfe8cdaf97?auto=format&fit=crop&w=900&q=80' },
      opinioes: [
        { usuario: 'Ana Paula', foto: 'https://randomuser.me/api/portraits/women/11.jpg', texto: 'Ambiente excelente e confortável!' },
        { usuario: 'João Pedro', foto: 'https://randomuser.me/api/portraits/men/22.jpg', texto: 'Espaço muito bem localizado.' }
      ]
    },
    {
      nome: 'Hub Criativo',
      descricao: 'Ambiente colaborativo para startups e freelancers.',
      imagem: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'
      ],
      avaliacao: 4.7,
      precoHora: 22,
      comodidades: ['Wi-Fi', 'Café', 'Salas de Reunião'],
      dono: { nome: 'Juliana Costa', foto: 'https://randomuser.me/api/portraits/women/44.jpg', perfilImagem: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=80' },
      opinioes: [
        { usuario: 'Fernanda', foto: 'https://randomuser.me/api/portraits/women/15.jpg', texto: 'Perfeito para networking!' },
        { usuario: 'Lucas', foto: 'https://randomuser.me/api/portraits/men/55.jpg', texto: 'Espaço moderno e inspirador.' }
      ]
    },
    {
      nome: 'Espaço Verde',
      descricao: 'Coworking com áreas ao ar livre e ambiente sustentável.',
      imagem: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80'
      ],
      avaliacao: 4.9,
      precoHora: 28,
      comodidades: ['Wi-Fi', 'Café', 'Área verde', 'Bicicletário'],
      dono: { nome: 'Marcos Silva', foto: 'https://randomuser.me/api/portraits/men/62.jpg', perfilImagem: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80' },
      opinioes: [
        { usuario: 'Beatriz', foto: 'https://randomuser.me/api/portraits/women/30.jpg', texto: 'A natureza dá outro clima ao ambiente.' },
        { usuario: 'Ricardo', foto: 'https://randomuser.me/api/portraits/men/41.jpg', texto: 'Muito tranquilo para trabalhar.' }
      ]
    },
    {
      nome: 'Open Office',
      descricao: 'Sala ampla com estações flexíveis e ótima iluminação.',
      imagem: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1587614382346-4ecba9ec3f50?auto=format&fit=crop&w=900&q=80'
      ],
      avaliacao: 4.6,
      precoHora: 30,
      comodidades: ['Wi-Fi', 'Café', 'Mesas Flexíveis', 'Sala de Reunião'],
      dono: { nome: 'Patrícia Nunes', foto: 'https://randomuser.me/api/portraits/women/50.jpg', perfilImagem: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80' },
      opinioes: [
        { usuario: 'Gabriel', foto: 'https://randomuser.me/api/portraits/men/51.jpg', texto: 'Espaço amplo e confortável.' },
        { usuario: 'Mariana', foto: 'https://randomuser.me/api/portraits/women/52.jpg', texto: 'Iluminação excelente.' }
      ]
    },
    {
      nome: 'Sala de Reunião VIP',
      descricao: 'Sala elegante com mesa grande, projetor e conforto total para reuniões importantes.',
      imagem: 'https://images.unsplash.com/photo-1581090700227-d93f0b7f37f7?auto=format&fit=crop&w=900&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1581090700227-d93f0b7f37f7?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1581091012184-56e646db1fa3?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1581091012190-1a8fefaf4971?auto=format&fit=crop&w=900&q=80'
      ],
      avaliacao: 4.9,
      precoHora: 40,
      comodidades: ['Wi-Fi', 'Projetor', 'Mesas confortáveis', 'Ar-condicionado'],
      dono: {
        nome: 'Ricardo Almeida',
        foto: 'https://randomuser.me/api/portraits/men/91.jpg',
        perfilImagem: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
      },
      opinioes: [
        { usuario: 'Carla', foto: 'https://randomuser.me/api/portraits/women/92.jpg', texto: 'Sala impecável para reuniões importantes.' },
        { usuario: 'Henrique', foto: 'https://randomuser.me/api/portraits/men/93.jpg', texto: 'Muito confortável e bem equipada.' }
      ]
    },
    {
      nome: 'Estúdio Criativo',
      descricao: 'Espaço para designers e artistas, com luz natural e ambientes inspiradores.',
      imagem: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'
      ],
      avaliacao: 4.7,
      precoHora: 27,
      comodidades: ['Wi-Fi', 'Café', 'Área de criação', 'Mesas de desenho'],
      dono: { nome: 'Rafael Souza', foto: 'https://randomuser.me/api/portraits/men/70.jpg', perfilImagem: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80' },
      opinioes: [
        { usuario: 'Julia', foto: 'https://randomuser.me/api/portraits/women/71.jpg', texto: 'Lugar inspirador e tranquilo.' },
        { usuario: 'Pedro', foto: 'https://randomuser.me/api/portraits/men/72.jpg', texto: 'Perfeito para criar e focar.' }
      ]
    },
    {
      nome: 'Tech Hub',
      descricao: 'Ambiente voltado para tecnologia, startups e desenvolvedores.',
      imagem: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1581091215360-5c90e5c5dff0?auto=format&fit=crop&w=900&q=80'
      ],
      avaliacao: 4.8,
      precoHora: 32,
      comodidades: ['Wi-Fi', 'Sala de Reunião', 'Café', 'Projetor'],
      dono: { nome: 'Mariana Alves', foto: 'https://randomuser.me/api/portraits/women/73.jpg', perfilImagem: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80' },
      opinioes: [
        { usuario: 'Felipe', foto: 'https://randomuser.me/api/portraits/men/74.jpg', texto: 'Ambiente moderno e tecnológico.' },
        { usuario: 'Amanda', foto: 'https://randomuser.me/api/portraits/women/75.jpg', texto: 'Muito produtivo para startups.' }
      ]
    },
    {
      nome: 'Sala de Treinamento',
      descricao: 'Espaço ideal para workshops, treinamentos e palestras com todos os recursos necessários.',
      imagem: 'https://images.unsplash.com/photo-1560184897-5b21b7a1deda?auto=format&fit=crop&w=900&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1560184897-5b21b7a1deda?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1581092580493-31e7c76f93e1?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1581092580492-8f6b4d71b0a6?auto=format&fit=crop&w=900&q=80'
      ],
      avaliacao: 4.6,
      precoHora: 29,
      comodidades: ['Wi-Fi', 'Projetor', 'Mesas de treinamento', 'Cadeiras confortáveis'],
      dono: {
        nome: 'Bruno Lima',
        foto: 'https://randomuser.me/api/portraits/men/76.jpg',
        perfilImagem: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
      },
      opinioes: [
        { usuario: 'Larissa', foto: 'https://randomuser.me/api/portraits/women/77.jpg', texto: 'Muito bem equipado e organizado.' },
        { usuario: 'Thiago', foto: 'https://randomuser.me/api/portraits/men/78.jpg', texto: 'Ideal para workshops.' }
      ]
    },
    {
      nome: 'Espaço Lounge',
      descricao: 'Ambiente descontraído para reuniões informais e networking.',
      imagem: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=900&q=80'
      ],
      avaliacao: 4.5,
      precoHora: 20,
      comodidades: ['Wi-Fi', 'Café', 'Sofás', 'Área de descanso'],
      dono: { nome: 'Camila Rocha', foto: 'https://randomuser.me/api/portraits/women/79.jpg', perfilImagem: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80' },
      opinioes: [
        { usuario: 'Daniel', foto: 'https://randomuser.me/api/portraits/men/80.jpg', texto: 'Ótimo para reuniões informais.' },
        { usuario: 'Patrícia', foto: 'https://randomuser.me/api/portraits/women/81.jpg', texto: 'Espaço relaxante e agradável.' }
      ]
    },
    {
      nome: 'Coworking Executivo',
      descricao: 'Ambiente corporativo com salas privativas e recepção elegante.',
      imagem: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=900&q=80'
      ],
      avaliacao: 4.9,
      precoHora: 35,
      comodidades: ['Wi-Fi', 'Salas Privativas', 'Café', 'Recepção'],
      dono: { nome: 'Fábio Cardoso', foto: 'https://randomuser.me/api/portraits/men/82.jpg', perfilImagem: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80' },
      opinioes: [
        { usuario: 'Renata', foto: 'https://randomuser.me/api/portraits/women/83.jpg', texto: 'Muito profissional e elegante.' },
        { usuario: 'Gustavo', foto: 'https://randomuser.me/api/portraits/men/84.jpg', texto: 'Espaço perfeito para negócios.' }
      ]
    },
    {
      nome: 'Espaço Colaborativo',
      descricao: 'Área aberta para equipes colaborarem e criarem projetos juntos.',
      imagem: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=900&q=80'
      ],
      avaliacao: 4.7,
      precoHora: 23,
      comodidades: ['Wi-Fi', 'Mesas abertas', 'Café', 'Área de brainstorming'],
      dono: { nome: 'Tatiana Lima', foto: 'https://randomuser.me/api/portraits/women/85.jpg', perfilImagem: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80' },
      opinioes: [
        { usuario: 'Paulo', foto: 'https://randomuser.me/api/portraits/men/86.jpg', texto: 'Espaço ideal para colaboração.' },
        { usuario: 'Carolina', foto: 'https://randomuser.me/api/portraits/women/87.jpg', texto: 'Muito inspirador e funcional.' }
      ]
    },
    {
      nome: 'Loft Inspirador',
      descricao: 'Espaço amplo com design moderno, perfeito para freelancers e pequenas equipes.',
      imagem: 'https://images.unsplash.com/photo-1499914485622-a88fac5362f5?auto=format&fit=crop&w=900&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1499914485622-a88fac5362f5?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80'
      ],
      avaliacao: 4.8,
      precoHora: 30,
      comodidades: ['Wi-Fi', 'Café', 'Salas privativas', 'Mesa de reunião'],
      dono: {
        nome: 'Letícia Martins',
        foto: 'https://randomuser.me/api/portraits/women/88.jpg',
        perfilImagem: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
      },
      opinioes: [
        { usuario: 'Rafael', foto: 'https://randomuser.me/api/portraits/men/89.jpg', texto: 'Ambiente moderno e funcional.' },
        { usuario: 'Isabela', foto: 'https://randomuser.me/api/portraits/women/90.jpg', texto: 'Adorei trabalhar aqui, super confortável!' }
      ]
    }
  ];

  espacosFiltrados = [...this.espacos];

  // Campos de filtro
  termoBusca: string = '';
  filtroAvaliacao: string = '';
  filtroPreco: string = '';

  filtrarEspacos() {
    let resultado = [...this.espacos];

    // Busca por título ou dono
    if (this.termoBusca) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(e =>
        e.nome.toLowerCase().includes(termo) ||
        e.dono.nome.toLowerCase().includes(termo)
      );
    }

    // Filtrar por avaliação mínima
    if (this.filtroAvaliacao) {
      const aval = parseFloat(this.filtroAvaliacao);
      resultado = resultado.filter(e => e.avaliacao >= aval);
    }

    // Filtrar por preço
    if (this.filtroPreco) {
      resultado.sort((a, b) => 
        this.filtroPreco === 'asc' ? a.precoHora - b.precoHora : b.precoHora - a.precoHora
      );
    }

    this.espacosFiltrados = resultado;
  }

  abrirDetalhes(espaco: any) {
    this.espacoSelecionado = espaco;
    this.imagemIndex = 0;
  }

  fecharModal() {
    this.espacoSelecionado = null;
  }

  proximaImagem() {
    if (this.espacoSelecionado) {
      this.imagemIndex = (this.imagemIndex + 1) % this.espacoSelecionado.imagens.length;
    }
  }

  anteriorImagem() {
    if (this.espacoSelecionado) {
      this.imagemIndex =
        (this.imagemIndex - 1 + this.espacoSelecionado.imagens.length) %
        this.espacoSelecionado.imagens.length;
    }
  }

  abrirPerfil(dono: any) {
    alert(`Abrindo perfil de ${dono.nome}`);
  }
}
