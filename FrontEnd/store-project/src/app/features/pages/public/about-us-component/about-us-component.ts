import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface Feature {
  icon: string;
  title: string;
  desc: string;
  color: string;
}

interface TeamMember {
  name: string;
  initials: string;
  role: string;
  bio: string;
  color: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './about-us-component.html',
  styleUrl: './about-us-component.scss',
})
export class AboutComponent {

  values: Feature[] = [
    { icon: 'handshake', title: 'Confianza', desc: 'Relaciones honestas con clientes y proveedores.', color: '#1976d2' },
    { icon: 'bolt', title: 'Agilidad', desc: 'Procesos rápidos y sin fricciones.', color: '#f57c00' },
    { icon: 'diversity_3', title: 'Inclusión', desc: 'Para todos, sin excepciones.', color: '#388e3c' },
    { icon: 'eco', title: 'Sostenibilidad', desc: 'Comprometidos con el planeta.', color: '#2e7d32' },
  ];

  team: TeamMember[] = [
    { name: 'Ana García', initials: 'AG', role: 'CEO & Fundadora', bio: 'Visionaria del e-commerce con 10 años de experiencia.', color: '#7b1fa2' },
    { name: 'Carlos Ruiz', initials: 'CR', role: 'CTO', bio: 'Arquitecto de software apasionado por el código limpio.', color: '#1565c0' },
    { name: 'María López', initials: 'ML', role: 'Head of Design', bio: 'Diseñadora UX con enfoque en experiencias memorables.', color: '#c62828' },
  ];
}