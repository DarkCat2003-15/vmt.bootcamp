import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './public-header-component.html',
  styleUrl: './public-header-component.scss',
})
export class PublicHeaderComponent {}