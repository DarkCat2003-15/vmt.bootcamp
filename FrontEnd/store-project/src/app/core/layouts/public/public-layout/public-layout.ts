import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicHeaderComponent } from '../components/public-header-component/public-header-component';
import { PublicNavbarComponent } from '../components/public-navbar-component/public-navbar-component';
import { PublicFooterComponent } from '../components/public-footer-component/public-footer-component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    PublicHeaderComponent,
    PublicNavbarComponent,
    PublicFooterComponent,
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayoutComponent {}